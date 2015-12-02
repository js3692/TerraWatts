var _ = require('lodash');
var Promise = require('bluebird');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

var Player = mongoose.model('Player');
var Auction = mongoose.model('Auction');

var determineTurnOrder =	require('../utils/0_basic_rules/turnOrder');
var dONP =								require('../utils/0_basic_rules/dependsOnNumPlayers.js');
var drawPlant =						require('../utils/1_plant_phase/drawPlant');
var resourcePrice =				require('../utils/2_resource_phase/price');
var cityPrice =						require('../utils/3_city_phase/price');
var payments =						require('../utils/4_bureaucracy_phase/payments.js');

var plantSpaces = dONP.plantSpaces;
var endGame = dONP.endGame;

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
	}
});

schema.methods.initialize = function (game) {
	if(this.phase === 'resource' && game.turn === 1) {
		game.turnOrder = determineTurnOrder(game.turnOrder);
	}
	this.numPasses = 0;
	this.remainingPlayers = this.setRemainingPlayers(game);
	return this.go(game);
};

schema.methods.go = function (game) {
	if (!this.remainingPlayers.length) return this.end(game);
	if (this.phase !== 'bureaucracy' || this.remainingPlayers.length === game.turnOrder.length) {
		this.activePlayer = this.remainingPlayers[0];
		return Promise.all([this.save(), game.save()]);
	}
};

schema.methods.continue = function(update, game) {
	console.log('state continue has been called');
    if(this.phase !== 'plant' || this.remainingPlayers.length === 1 && update.data !== 'pass') {
		return this.transaction(update, game);
	} else {
		if (update.data === 'pass') {
            console.log('in pass')
			this.remainingPlayers = this.removePlayer(update.player);
            console.log(this.remainingPlayers);
			this.numPasses++;
			return this.go(game)
		} else {
			// start an auction
            console.log('starting an auction now');
			var self = this;
			var auction = new Auction({
				plant: update.data.plant,
				bid: update.data.bid,
                highestBidder: update.player,
				plantState: self
			})
			return auction.initialize()
            .then(function (_auction) {
                self.auction = _auction;
                return self.save();
            })
			// for testing:
			// return Promise.resolve(['auction', update.data.plant, update.data.bid]);
		}
	}
}

schema.methods.end = function(game) {
	if(this.phase === 'plant') {
		if (this.numPasses === game.turnOrder.length) {
			game.discardedPlants.push(game.plantMarket.shift());
			game = drawPlant(game);
		}
		if(game.step === 2.5) {
			game.discardedPlants.push(game.plantMarket.shift());
			game.step = 3;
		}		
	}
	if (this.phase === 'bureaucracy') {
		var maxCities = game.turnOrder.reduce(function (prev, curr) {
			return Math.max(prev, curr.cities.length);
		}, 0);

		// check end game condition
		if (maxCities >= endGame[game.turnOrder.length]) {
			// sort the players by win condition
			var winningOrder = game.turnOrder.sort(function(player1, player2) {
				if (player1.numPowered > player2.numPowered) return -1;
				else if (player1.numPowered < player2.numPowered) return 1;
				else if (player1.money > player2.money) return -1;
				else return 1;
			})
			// return gameOver(winningOrder)
		}

		// start step 2 if necessary
		if (game.step === 1 && maxCities > step2[game.turnOrder.length]) {
			game.step = 2;
			game.discardedPlants.push(game.plantMarket.shift());
			game = drawPlant(game);
		}

		// restock resources
		game.restockRates = restockRatesMaster[game.turnOrder.length][game.step];
		for(var resource in game.resourceMarket) {
			var canFill = Math.min(game.restockRates[resource], game.resourceBank[resource]);
			game.resourceBank[resource] -= canFill;
			game.resourceMarket[resource] += canFill;
		}

		if (game.step === 3) {
			game.discardedPlants.push(game.plantMarket.shift());
		} else {
			game.stepThreePlants.push(game.plantMarket.pop());
		}
		game = drawPlant(game);
		game.turn++;
		game.turnOrder = determineTurnOrder(game.turnOrder);
	}
	this.phase = phases[phases.indexOf(this.phase) + 1] || phases[0];
	return this.initialize(game);
}

schema.methods.transaction = function(update, game) {
    var self = this;
	return Player.findById(update.player._id)
	.then(function (player) {
        console.log('database player', player)
		self.remainingPlayers = self.removePlayer(player);
		if (self.phase === 'plant') {
			self.auction = null;
			player.money -= update.data.bid;
			var plantIndex;
			game.plantMarket.forEach(function (plant,i) {
				if (plant.equals(update.data.plant._id)) plantIndex = i;
			});
			var plant = game.plantMarket.splice(plantIndex,1)[0];
			player.plants.push(plant);
			game = drawPlant(game);
			if (player.plants.length > plantSpaces[game.turnOrder.length]) {
				// make player discard a plant
			}
		} else if (self.phase === 'resource') {
			var wishlist = update.data;
			player.money -= resourcePrice(wishlist, game.resourceMarket);
			for(var resource in wishlist) {
		        game.resourceMarket[resource] -= wishlist[resource];
		        player.resources[resource] += wishlist[resource];
	    	}
		} else if (self.phase === 'city') {
			var citiesToAdd = update.data;
			player.money -= cityPrice(citiesToAdd, game, player);
			player.cities = player.cities.concat(citiesToAdd);
			// remove plant from market if necessary
			while (player.cities.length >= game.plantMarket[0].rank) {
				game.discardedPlants.push(game.plantMarket.shift());
				game = drawPlant(game);
			}
			// add the player to each city
			citiesToAdd.forEach(function (cityToAdd) {
				var city = _.find(game.cities, function (c) {
					return c._id.equals(cityToAdd._id);
				});
				city.players.push(player);
			})
		} else if (self.phase === 'bureaucracy') {
			var plantsToPower = update.data;
			var totalCapacity = 0;
			plantsToPower.forEach(function (plant) {
				totalCapacity += plant.capacity;
				if (plant.resourceType === 'hybrid') {
					// transition to hybrid choice state
				} else {
					// move resources from player to bank
					player.resources[plant.resourceType] -= plant.resourceNum;
					game.resourceBank[plant.resourceType] += plant.resourceNum;
				}
			})
			player.numPowered = Math.min(player.cities.length, totalCapacity);
			player.money += payments[player.numPowered];
		}
		return player.save();
	})
	.then(function() {
		return self.go(game);
	})
	
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