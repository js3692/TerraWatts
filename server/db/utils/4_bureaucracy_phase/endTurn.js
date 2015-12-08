var dONP = require('../0_basic_rules/dependsOnNumPlayers');
var endGame = dONP.endGame;
var stepTwo = dONP.stepTwo;
var drawPlant = require('../1_plant_phase/drawPlant');
var masterRestockRates = require('../0_basic_rules/restock');
var determineTurnOrder =	require('../0_basic_rules/turnOrder');


module.exports = function endTurn(game, state) {
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
	if (game.step === 1 && maxCities >= stepTwo[game.turnOrder.length]) {
		game.step = 2;
		game.discardedPlants.push(game.plantMarket.shift());
		game = drawPlant(game, state);
	}

	// restock resources
	game.restockRates = masterRestockRates[game.turnOrder.length][game.step];
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
	game = drawPlant(game, state);
	game.turn++;
	game.turnOrder = determineTurnOrder(game.turnOrder);
}