var resourcePrice = require('../utils/2_resource_phase/price.js');
var verifyResources = require('../utils/2_resource_phase/resourceVerification.js');
var cityPrice = require('../utils/3_city_phase/price.js');
var numResidents = require('../utils/3_city_phase/numResidents.js');

// global
function isActive(update, grid) {
	var activePlayer = grid.state.activePlayer;
	if (grid.state.auction) activePlayer = grid.state.auction.activePlayer;
	return activePlayer.equals(update.player._id);
}

function isCorrectPhase(update, grid) {
	return update.phase === grid.state.phase;
}

// plant
function cannotPassFirstTurn(update, grid) {
	return !!grid.state.auction || update.data !== 'pass' || grid.game.turn > 1;
}

function plantIsAvailable(update, grid) {
    if(update.data === 'pass') return true;
	var numAvail = grid.game.step < 3 ? 4 : 6;
	var availablePlants = grid.game.plantMarket.slice(0, numAvail);
    var isAvailable = false;
	availablePlants.forEach(function (plant) {
		if (plant.equals(update.data.plant._id)) isAvailable = true;
	})
	return isAvailable;
}

function canAffordBid(update) {
    if(update.data === 'pass') return true;
	return update.player.money >= update.data.bid;
}

// resources
function canHoldResources(update) {
	return verifyResources(update.player, update.data.wishlist);
}

function canAffordResources(update, grid) {
	return update.player.money >= resourcePrice(update.data.wishlist, grid.game.resourceMarket);
}

// city
function canBuyCities(update, grid) {
	var canBuy = true;
	update.data.citiesToAdd.forEach(function (city) {
		if (numResidents(city, grid.players) >= grid.game.step) canBuy = false;
		if(update.player.cities) update.player.cities.forEach(function (c) {
			if (c._id === city._id) canBuy = false;
		})
	})
	return canBuy;
}

function canAffordCities(update, grid) {
	return update.player.money >= cityPrice(grid.game, update.data.citiesToAdd, update.player);
}

// bureaucracy
function hasResources(update) {
	var has = {};
	var needs = {};
	update.data.plantsToPower.forEach(function (plant) {
		needs[plant.resourceType] = needs[plant.resourceType] + plant.numResources || plant.numResources;
	});
	var enoughResources = true;
	['coal', 'oil', 'trash', 'nuke'].forEach(function (resource) {
		has[resource] = update.player.resources[resource];
		has[resource] -= needs[resource];
		if(has[resource] < 0) enoughResources = false;
	});
	if(needs.hybrid && needs.hybrid > has.coal + has.oil) enoughResources = false;
	return enoughResources;
}

function hasResourceChoiceIfNeeded(update) {
	if (update.data.plantsToPower.every(plantToPower => plantToPower.resourceType !== "hybrid")) return true;
	if (update.choice && update.choice.resourcesToUseForHybrids) return true;
	var has = {};
	var needs = {};
	update.data.plantsToPower.forEach(function (plant) {
		needs[plant.resourceType] = needs[plant.resourceType] + plant.numResources || plant.numResources;
	});
	['coal', 'oil'].forEach(function (resource) {
		has[resource] = update.player.resources[resource];
		has[resource] -= needs[resource];
	});
	return !(needs.hybrid && has.coal && has.oil && (needs.hybrid < has.coal + has.oil))
}

module.exports = {
	global: [{
			func: isActive,
			message: 'You are not the active player'
		},
		{
			func: isCorrectPhase,
			message: 'Request coming from wrong phase'
		}],

	plant: [{
			func: cannotPassFirstTurn,
			message: 'Cannot pass on the first turn'
		},
		{
			func: plantIsAvailable,
			message: 'This plant is not available'
		},
		{
			func: canAffordBid,
			message: 'You cannot afford this bid'
		}],

	resource: [{
			func: canHoldResources,
			message: 'Your plants cannot fit those resources'
		},
		{
			func: canAffordResources,
			message: 'You cannot afford the resources'
		}],

	city: [{
			func: canBuyCities,
			message: 'Some of those cities are unavailable'
		},
		{
			func: canAffordCities,
			message: 'You cannot afford those cities'
		}],

	bureaucracy: [{
			func: hasResources,
			message: 'You do not have enough resources'
		},
		{
			func: hasResourceChoiceIfNeeded,
			message: 'You need to specify a choice for powering your hybrid(s)'
		}]
}