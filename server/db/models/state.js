var mongoose = require('mongoose');
var _ = require('lodash');
var determineTurnOrder = require('../../game/utils/turnOrder.js');
var resourcePrice = require('../../game/resourceState/price.js');
var cityPrice = require('../../game/cityState/price.js');
var drawPlant = require('../../game/utils/drawPlant.js');
var payments = require('../../game/endOfTurn/payments.js');
var dONP = require('../../game/utils/dependsOnNumPlayers.js')
var plantSpaces = dONP.plantSpaces;
var endGame = dONP.endGame;


var steps = ['plant', 'resource', 'city', 'turnover'];

var schema = new mongoose.Schema({
	game: {
		type: Object,
		required: true
	},
	step: {
		type: String,
		required: true,
		enum: steps
	},
	remainingPlayers: {
		type: [Object]
	},
	activePlayer: {
		type: Object
	},
	nextStep: {
		type: String,
		enum: steps
	},
	// used in plant state
	numPasses: {
		type: Number,
		default: 0
	}
})

schema.pre('save', function() {
	if(this.step === 'resource' && this.game.turn === 1) {
		this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
	}
	this.nextStep = this.steps[this.steps.indexOf(this.step) + 1] || this.steps[0];
	this.remainingPlayers = this.setRemainingPlayers();
});

schema.methods.go = function() {
	if (!this.remainingPlayers.length) return this.end();
	if (this.step !== 'turnover' || this.remainingPlayers.length === this.game.turnOrder.length) {
		this.activePlayer = this.remainingPlayers[0];
		return this;
	}
}

/* 
update is an object with two keys: player and data
data is different depending on the step:
	resource: data is the wishlist object
	city: data is an array of cities to buy
	plant: data is 'pass', or {plant: plant, price: price}
		price is opening bid, or result of auction
	endofturn: data is an array of plants being powered
*/
schema.methods.continue = function(update) {
	if(this.step !== plant || this.remainingPlayers.length === 1) {
		this.game = this.transaction(update);
	} else {
		if (update.data === 'pass') {
			this.remainingPlayers = this.removePlayer(update.player);
			this.numPasses++;
		} else {
			// start an auction (return)
		}
	}
	return this.go();
}

schema.methods.end = function() {
	if(this.step === 'plant') {
		if (this.numPasses === this.game.turnOrder.length) {
			this.game.discardedPlants.push(this.game.plantMarket.shift());
			drawPlant(this.game);
		}
		if(this.game.phase === 2.5) {
			this.game.discardedPlants.push(this.game.plantMarket.shift());
			this.game.phase = 3;
		}		
	}
	if (this.step === 'turnover') {
		var maxCities = this.game.turnOrder.reduce(function (prev, curr) {
			return Math.max(prev, curr.numCities);
		}, 0);

		// check end game condition
		if (maxCities >= endGame[this.game.turnOrder.length]) {
			// sort the players by win condition
			this.game.turnOrder.sort(function(player1, player2) {
				if (player1.numPowered > player2.numPowered) return -1;
				else if (player1.numPowered < player2.numPowered) return 1;
				else if (player1.money > player2.money) return -1;
				else return 1;
			})
			// return gameOver(this.turnOrder)
		}

		// start phase 2 if necessary
		if (this.game.phase === 1 && maxCities > phase2[this.game.turnOrder.length]) {
			this.game.phase = 2;
			this.game.discardedPlants.push(this.game.plantMarket.shift());
			drawPlant(this.game);
		}

		// restock resources
		this.game.restockRates = restockRatesMaster[this.turnOrder.length][this.phase];
		for(var resource in this.game.resources) {
			var canFill = Math.min(this.game.restockRates[resource], this.game.resourceBank[resource]);
			this.game.resourceBank -= canFill;
			this.game.resources += canFill;
		}

		if (this.game.phase === 3) {
			this.game.discardedPlants.push(this.game.plantMarket.shift());
		} else {
			this.game.phase3Plants.push(this.game.plantMarket.pop());
		}
		drawPlant(this.game);
		this.game.turn++;
		this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
	}

	var nextState = new State({
		game: this.game,
		step: this.nextStep
	});
	return nextState.go();
}

schema.methods.transaction = function(update) {
	var player = _.find(this.game.turnOrder, function (p) {
		return p.color = update.player.color;
	});
	this.playersRemaining = this.removePlayer(player);
	if (this.step === 'plant') {
		player.money -= update.data.price;
		var plantIndex;
		this.game.plantMarket.forEach(function (plant,i) {
			if (plant.rank === update.data.plant.rank) plantIndex = i;
		});
		var plant = this.game.plantMarket.splice(plantIndex,1)[0];
		player.plants.push(plant);
		drawPlant(this.game);
		if (player.plants.length > plantSpaces[this.game.turnOrder.length]) {
			// make player discard a plant
		}
	} else if (this.step === 'resource') {
		var wishlist = update.data;
		player.money -= resourcePrice(wishlist, this.game.resourceMarket);
		for(var resource in wishlist) {
	        this.game.resourceMarket[resource] -= wishlist[resource];
	        player.resources[resource] += wishlist[resource];
    	}
	} else if (this.step === 'city') {
		var citiesToAdd = update.data;
		player.money -= cityPrice(citiesToAdd, this.game);
		player.numCities += citiesToAdd.length;
		// remove plant from market if necessary
		while (player.numCities >= this.game.plantMarket[0].rank) {
			this.game.discardedPlants.push(this.game.plantMarket.shift());
			drawPlant(this.game);
		}
		// add the player to each city
		citiesToAdd.forEach(function (cityToAdd) {
			var city = _.find(this.game, function (c) {
				return c._id.equals(cityToAdd._id);
			});
			city.players.push(player);
		})
	} else if (this.step === 'turnover') {
		var totalCapacity = 0;
		plantsToPower.forEach(function (plant) {
			totalCapacity += plant.capacity;
			if (plant.resourceType === 'hybrid') {
				// transition to hybrid choice state
			} else {
				// move resources from player to bank
				player.resources[plant.resourceType] -= plant.resourceNum;
				this.game.resourceBank[plant.resourceType] += plant.resourceNum;
			}
		})
		player.numPowered = Math.min(player.numCities, totalCapacity);
		player.money += payments[player.numPowered];
	}
	return this.game;
}

schema.methods.setRemainingPlayers = function() {
	if (this.step === 'plant') return this.game.turnOrder.slice();
	else return this.game.turnOrder.slice().reverse();
}

schema.methods.removePlayer = function(player) {
	return this.playersRemaining.filter(function (p) {
		return p.color !== player.color;
	})
}

mongoose.model('State', schema);
