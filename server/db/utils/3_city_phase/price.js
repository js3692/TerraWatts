var dij = require('./dijkstra.js');
var numResidents = require('./numResidents');


// cities are entire cities.
module.exports = function totalCost(game, citiesToAdd, player) {
	var network = player.cities || [];
	var connectionCost = dij(citiesToAdd, network, game.cities, game.connections);
	var citiesCost = citiesToAdd.reduce(function(prevCost, currentCity) {
		var cityCost = numResidents(currentCity, game.turnOrder)*5 + 10;
		return prevCost + cityCost;
	}, 0);
	return connectionCost + citiesCost;
}