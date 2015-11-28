var State = require('../state');
var totalPrice = require('./price.js');
var isOccupiedBy = require('./isOccupiedBy.js');
var drawPlant = require('../utils/drawPlant.js')
var _ = require('lodash');
var endOfTurn = require('../endOfTurn')

var validators = [
	function citiesAreOpen(game, citiesToAdd) {
		return citiesToAdd.every(function (city) {
			return !isOccupiedBy(game.activePlayer, city) && city.players.length < game.phase;
		})
	},
	function canAfford(game, citiesToAdd) {
		return totalPrice(game, citiesToAdd) <= game.activePlayer.money;
	}

];

var CityState = function(game) {
	this.game = game;
	this.validators = validators;
	this.turnIndex = 1;
	State.call(this);
}

CityState.prototype = Object.create(State.prototype);
CityState.prototype.constructor = CityState;

CityState.prototype.go = function() {
	this.game.activePlayer = this.game.turnOrder.slice(-1)[0];
	// return save/update game
}

CityState.prototype.continue = function(citiesToAdd) {
	// find the correct player to manipulate
	var player = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
	player.money -= totalPrice(this.game, citiesToAdd);
	player.numCities += citiesToAdd.length;
	// RULE: discard plants with lower or equal ranks to numCities
	while (player.numCities >= this.game.plantMarket[0].rank) {
		this.game.discardedPlants.push(this.game.plantMarket.shift());
		drawPlant(this.game);
	}
	// add the player to each city's players array
	citiesToAdd.forEach(function (cityToAdd) {
		var city = _.find(this.game, function (c) {
			return c._id.equals(cityToAdd._id);
		});
		city.players.push(player);
	})
	// transition or continue
	this.turnIndex++;
	if (this.turnIndex > this.game.turnOrder.length) {
		this.game.currentState = new endOfTurn(this.game);
		this.game.currentState.go();
	} else {
		this.game.activePlayer = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
		// return save/update game
	}
}

module.exports = CityState;