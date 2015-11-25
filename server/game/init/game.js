var restockRatesMaster = require('./restock.js');
var shuffle = require('../utils/shuffle')
var plantState = require('../plantState')

function removePlants(shuffledPlants, numPlayers) {
	if(numPlayers < 5) {
		shuffledPlants.splice(0,4);
	}
	if(numPlayers < 4) {
		shuffledPlants.splice(0,4);
	}
	return shuffledPlants;
}

module.exports = function Game (players, plants, cities, connections) {
	if(players.length < 2 || players.length > 6) {
		throw new Error('not a valid number of players');
	}
	this.turnOrder = shuffle(players);

	this.turn = 1;
	this.phase = 1;

	this.cities = cities;
	this.connections = connections;

	this.resourceMarket = {coal: 24, oil: 15, trash: 6, nuke: 2};
	this.resourceBank = {coal: 0, oil: 9, trash: 18, nuke: 10};
	this.restockRates = restockRatesMaster[this.turnOrder.length][this.phase];

	this.plantMarket = plants.splice(0, 8);
	var thirteen = plants.splice(2, 1);
	plants = removePlants(shuffle(plants), this.turnOrder.length);

	this.plantDeck = thirteen.concat(plants);
	this.discardedPlants = [];
	this.phase3Plants = [];
    
    this.activePlayer = null;
    this.currentState = new PlantState(this);
}