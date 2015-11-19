var restockRatesMaster = require('./restock.js');
var plants = require('./testNewGame')[0];
var players = require('./testNewGame')[1];
var resourceRound = require('./game/resourceRound');

var Game = function(players, plants, cities, connections) {
	this.players = shuffle(players);
	if(this.players.length < 2 || this.players.length > 6) {
		throw new Error('not a valid number of players');
	}
	this.turnOrder = shuffle(this.players);

	this.cities = cities;
	this.connections = connections;
	this.turn = 0;
	this.phase = 1;

	this.resourceMarket = {coal: 24, oil: 15, trash: 6, nuke: 2};
	this.restockRates = restockRatesMaster[this.players.length][this.phase];

	this.plantMarket = plants.splice(0, 8);
	thirteen = plants.splice(2, 1);
	plants = removePlants(shuffle(plants), this.players.length);

	this.plantDeck = thirteen.concat(plants);
	this.discardedPlants = [];
	this.phase3Plants = [];
    
    this.currentState = new resourceRound(this);
    this.turn;
    
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

game = new Game(players, plants, [], []);
// console.log(game);
// console.log('player0: ' + game.players[0])
// console.log('amount in plant deck:' + game.plantDeck.length)

