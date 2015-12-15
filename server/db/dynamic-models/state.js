var Firebase = require('firebase');
var Promise = require('bluebird');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

var Player = mongoose.model('Player');
var Auction = mongoose.model('Auction');
// var Choice = mongoose.model('Choice');

var determineTurnOrder =	require('../utils/0_basic_rules/turnOrder');
var dONP =								require('../utils/0_basic_rules/dependsOnNumPlayers.js');
var drawPlant =						require('../utils/1_plant_phase/drawPlant');
var resourcePrice =				require('../utils/2_resource_phase/price');
var cityPrice =						require('../utils/3_city_phase/price');
var payments =						require('../utils/4_bureaucracy_phase/payments.js');
var loseResources = require('../utils/1_plant_phase/loseResources');
var plantSpaces = dONP.plantSpaces;
var spendHybridResources = require('../utils/4_bureaucracy_phase/spendHybridResources');
var endTurn = require('../utils/4_bureaucracy_phase/endTurn');

var phases = ['plant', 'resource', 'city', 'bureaucracy'];

var schema = new mongoose.Schema({
	phase: {
		type: String,
		enum: phases,
		default: 'plant'
	},
	remainingPlayers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	}],
	activePlayer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	},
	// used in plant state
	numPasses: {
		type: Number,
		default: 0
	},
	auction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Auction'
	},
	choice: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Choice'
	},
	key: {
		type: String
	}
});

schema.virtual('chatKey').get(function() {
	var baseUrl = "https://amber-torch-6713.firebaseio.com/";
	return baseUrl + this.key + '/chat';
})

schema.methods.log = function(name, action) {
	var fbRef = new Firebase(this.chatKey);
	var message = name + ' ' + action;
	fbRef.push({
		user: 'LOG',
		message: message
	})
}

schema.methods.initialize = function (game) {
	var self = this;
	if(this.phase === 'resource' && game.turn === 1) {
		var playerIds = game.turnOrder.map(player => player._id);
		return Player.find({ _id: { $in:  playerIds } }).populate('cities plants')
			.then(function (foundPlayers) {
				game.turnOrder = determineTurnOrder(foundPlayers).map(orderedPlayer => orderedPlayer._id);
				self.numPasses = 0;
				self.remainingPlayers = self.setRemainingPlayers(game);
				return self.go(game);
			});
	} else {
		this.numPasses = 0;
		this.remainingPlayers = this.setRemainingPlayers(game);
		return this.go(game);
	}
};

schema.methods.go = function (game) {
	if (!this.remainingPlayers.length) return this.end(game);

	if (this.phase !== 'bureaucracy' || this.remainingPlayers.length === game.turnOrder.length) {
		this.activePlayer = this.remainingPlayers[0];
    game.markModified('resourceMarket');
    game.markModified('turnOrder');
		return Promise.all([this.save(), game.save()])
	} else {
		delete game.resourceBank.green;
		game.markModified('resourceBank');
		Promise.all([this.save(), game.save()]);
	}
};

schema.methods.continue = function(update, game) {
	var self = this;

  if(this.phase !== 'plant' && update.data !== 'pass') {
		
		return this.transaction(update, game);

	} else {
		if (update.data === 'pass') {

			this.remainingPlayers = this.removePlayer(update.player);
			this.numPasses++;

			return this.go(game)

		} else {
			
			// start an auction

			this.auction = new Auction({
				plant: update.data.plant,
				bid: update.data.bid,
        		highestBidder: update.player,
				plantState: self
			});

			
			return this.auction.initialize(game)
				.then(function () {
					return self.save();
				});
		}
	}
}

schema.methods.end = function (game) {
	if(this.phase === 'plant') {
		if (this.numPasses === game.turnOrder.length) {
			game.discardedPlants.push(game.plantMarket.shift());
			game = drawPlant(game, this);
		}
		if(game.step === 2.5) {
			game.discardedPlants.push(game.plantMarket.shift());
			game.step = 3;
		}		
	} // end of 'plant'
	if (this.phase === 'bureaucracy') {
		endTurn(game, this);
	} // end of 'bureaucracy'

	this.phase = phases[phases.indexOf(this.phase) + 1] || phases[0];

	return this.initialize(game);
}

schema.methods.transaction = function(update, game) {
  var self = this;
	return Player.findById(update.player._id || update.player).populate('user cities')
		.then(function (player) {
			
			self.remainingPlayers = self.removePlayer(player);

			if (self.phase === 'plant') {
				self.auction = null;
				player.money -= update.data.bid;
				
				var plantIndex;

				game.plantMarket.forEach(function (plant,i) {
					if (plant._id.equals(update.data.plant._id || update.data.plant)) plantIndex = i;
				});

				var plant = game.plantMarket.splice(plantIndex, 1)[0];
				player.plants.push(plant);
				loseResources(player, game);

				game = drawPlant(game, self);
				self.log(player.user.username, 'got the ' + plant.rank + ' for $' + update.data.bid);
			} // end of 'plant'
			else if (self.phase === 'resource') {
				var wishlist = update.data.wishlist;
				var price = resourcePrice(wishlist, game.resourceMarket);
				player.money -= price;
				var resourceLog = [];
				for(var resource in wishlist) {
					game.resourceMarket[resource] -= wishlist[resource];
					player.resources[resource] += wishlist[resource];
					if(wishlist[resource]) {
						resourceLog.push({resource: resource, num: wishlist[resource]});
					}
				}
				resourceLog = resourceLog.map(function(resourceGroup) {
					return '' + resourceGroup.num + ' ' + resourceGroup.resource;
				})
				self.log(player.user.username, 'bought ' + resourceLog.join(', ') + ' for $' + price);
			} // end of 'resource'
			else if (self.phase === 'city') {
				var citiesToAdd = update.data.citiesToAdd;
				var price = cityPrice(game, citiesToAdd, player);
				player.money -= price;
				citiesToAdd.forEach(function (city) {
					player.cities.push(city.id);
				})
				if(player.cities.length > game.maxCities) game.maxCities = player.cities.length;
				// remove plant from market if necessary
				while (player.cities.length >= game.plantMarket[0].rank) {
					game.discardedPlants.push(game.plantMarket.shift());
					game = drawPlant(game, self);
				}
				self.log(player.user.username, 'bought ' + citiesToAdd.length + ' cities for $' + price)
			} // end of 'city'
			else if (self.phase === 'bureaucracy') {

				var plantsToPower = update.data.plantsToPower;
				var totalCapacity = 0;

				var hybridResourcesNeeded = 0;

				plantsToPower.forEach(function (plantToPower) {
					totalCapacity += plantToPower.capacity;
					if (plantToPower.resourceType !== 'hybrid') {
						// move resources from player to bank
						player.resources[plantToPower.resourceType] -= plantToPower.numResources;
						game.resourceBank[plantToPower.resourceType] += plantToPower.numResources;
					} else {
						hybridResourcesNeeded += plantToPower.numResources;
					}
				});

				//spend resources for hybrid plants
				if(hybridResourcesNeeded) {
					spendHybridResources(hybridResourcesNeeded, player, update, game);
				}

				player.numPowered = Math.min(player.cities.length, totalCapacity);
				player.money += payments[player.numPowered];
				self.log(player.user.username, 'powered ' + player.numPowered + ' cities for $' + payments[player.numPowered]);
			} // end of 'bureaucracy'

			delete player.resources.green;
			player.markModified('resources');
			return player.save();
		})
		.then(function() {
			return self.go(game);
		});
};

schema.methods.setRemainingPlayers = function (game) {
	if (this.phase === 'plant') return game.turnOrder.slice();
	else return game.turnOrder.slice().reverse();
};

schema.methods.removePlayer = function (player) {
	return this.remainingPlayers.filter(function (p) {
		return !p.equals(player._id);
	})
};

mongoose.model('State', schema);