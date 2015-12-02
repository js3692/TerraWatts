var shuffle = require('../common/shuffle');

module.exports = function drawPlant(game, state) {
    if (game.plantDeck.length) {
        var plant = game.plantDeck.shift();
		game.plantMarket = game.plantMarket.concat(plant);
	} else {
		game = initStepThree(game, state);
	}
    console.log(game.plantMarket, 'plantMarket')
	game.plantMarket.sort(function (plant1, plant2) {
        console.log(plant1, plant2)
		return plant1.rank < plant2.rank ? -1 : 1;
	});
	return game;
};

function initStepThree(game, state) {
	if(game.step === 3) return game;
	if (state.phase === 'plant') {
		// stuff shouldn't actually happen here until the end of the state
		game.step = 2.5;
	} else {
		game.discardedPlants.push(game.plantMarket.shift());
		game.step = 3;
	}
	game.plantDeck = shuffle(game.phase3Plants);
	return game;
}