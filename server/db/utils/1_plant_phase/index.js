var State = require('../state');
var plantSpaces = require('../utils/dependsOnNumPlayers.js').plantSpaces;
var Auction = require('./Auction.js')

var validators = [
	function isValidChoice(game, choice) {
		if (choice === 'pass' || game.phase === 3) return true;
		return game.plantMarket.slice(0,4).some(function (plant) {
			return choice.rank === plant.rank;
		})
	},
	function canAfford(player, price) {
		return player.money >= price;
	}
]

var PlantState = function(game) {
	this.game = game;
	this.name = 'Plant';
	this.validators = validators;
	this.nextState = 'placeholder for resource state';
	this.numPasses = 0;
	this.canChoosePlant = this.game.turnOrder;
	State.call(this);
}

PlantState.prototype = Object.create(State.prototype);
PlantState.prototype.constructor = PlantState;

PlantState.prototype.go = function() {
	if (!this.canChoosePlant.length) return this.end();
	this.game.activePlayer = this.canChoosePlant[0];
	return this.game;
}

//format of choice: 'pass', or {plant: Plant, openingBid: num}
PlantState.prototype.continue = function(playerColor, choice) {
	if (choice === 'pass') {
		this.canChoosePlant.shift();
		this.numPasses++;
		this.go();
	} else {
		if (this.canChoosePlant.length === 1) return this.boughtPlant(playerColor, choice.plant, choice.plant.rank);
		else {
			var auction = new Auction(choice.plant, choice.openingBid, this);
			auction.go();
		}
	}	
}

PlantState.prototype.boughtPlant = function(playerColor, plant, price) {
	var player = this.game.turnOrder.filter(function (p) {
		return p.color === playerColor;
	})[0];
	player.money -= price;
	this.canChoosePlant = this.canChoosePlant.filter(function (player) {
		return player.color !== playerColor;
	})
	var plantIndex;
	this.game.plantMarket.forEach(function (plant,i) {
		if (plant.rank === rank) plantIndex = i;
	});
	var plant = this.game.plantMarket.splice(plantIndex,1)[0];
	player.plants.push(plant);
	drawPlant(this.game);
	if(player.plants.length > plantSpaces[this.game.turnOrder.length]) {
		// have the player discard a plant
	} else this.go();
}

PlantState.prototype.end = function() {
	if (this.numPasses === this.game.turnOrder.length) {
		this.game.discardedPlants.push(this.game.plantMarket.shift());
		drawPlant(this.game);
	}
	if(this.game.phase === 2.5) {
		this.game.discardedPlants.push(this.game.plantMarket.shift());
		this.game.phase = 3;
	}
	this.game.currentState = new ResourceState(this.game);
	this.game.currentState.go();
}

module.exports = PlantState;