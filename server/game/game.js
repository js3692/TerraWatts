var restockRatesMaster = require('./restock.js');
var regions = require('./regions.js')
var mongoose = require('mongoose');
// var connectToDb = require('../db');
var City = mongoose.model('City');
var Plant = mongoose.model('Plant');
var Connection = mongoose.model('Connection');
// var plants = require('./testNewGame')[0];
var players = require('./testNewGame')[1];
// var resourceRound = require('./resourceRound');

function Game (players, plants, cities, connections) {
	this.players = shuffle(players);
	if(this.players.length < 2 || this.players.length > 6) {
		throw new Error('not a valid number of players');
	}
	this.turnOrder = shuffle(this.players);

	this.turn = 0;
	this.phase = 1;

	var regionsInPlay = regions.randomize(this.turnOrder.length);
	this.cities = cities.filter(function (city) {
		return regionsInPlay.indexOf(city.region) > -1;
	});

	this.connections = connections.filter(function (connection) {
		return connection.cities.every(function (city) {
			return regionsInPlay.indexOf(city.region) > -1;		
		})
	});

	this.resourceMarket = {coal: 24, oil: 15, trash: 6, nuke: 2};
	this.resourceBank = {coal: 0, oil: 9, trash: 18, nuke: 10};
	this.restockRates = restockRatesMaster[this.players.length][this.phase];

	this.plantMarket = plants.splice(0, 8);
	var thirteen = plants.splice(2, 1);
	plants = removePlants(shuffle(plants), this.players.length);

	this.plantDeck = thirteen.concat(plants);
	this.discardedPlants = [];
	this.phase3Plants = [];
    
    // this.currentState = new resourceRound(this);
    // this.turn;
    
}


function shuffle(array) {
  var newArray = array.slice();
  var copy = [], n = newArray.length, i;
  while (n) {
    i = Math.floor(Math.random() * newArray.length);
    if (i in newArray) {
      copy.push(newArray[i]);
      delete newArray[i];
      n--;
    }
  }
  return copy;
}

function removePlants(shuffledPlants, numPlayers) {
	if(numPlayers < 5) {
		shuffledPlants.splice(0,4);
	}
	if(numPlayers < 4) {
		shuffledPlants.splice(0,4);
	}
	return shuffledPlants;
}

// var plants, cities, connections;
// Plant.find()
// .then(function (_plants) {
// 	plants = _plants;
// 	return City.find()
// })
// .then(function (_cities) {
// 	cities = _cities;
// 	return Connection.find().populate('cities')
// })
// .then(function (_connections) {
// 	connections = _connections;
// })

