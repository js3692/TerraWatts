var _ = require('lodash');
var mongoose = require('mongoose');
require('../db');
var City = mongoose.model('City');
var Connection = mongoose.model('Connection');

function cheapestDistanceTo(destination, network, cities, connections) {
	//if player has no cities, they don't pay any connection cost
	if(!network.length) return 0;

	//for every city in cities, assign a tentative distance value of 0 if in network, infinity otherwise
	//mark cities in network visited, other cities unvisited
	var data = cities.map(function(city) {
		var distance = Infinity;
		var visited = false;
		if (_.find(network, function(c) {
			c._id.equals(city._id);
		})) distance = 0, visited = true;
		return {
			city: city,
			distance: distance,
			visited: visited
		}
	})
	return data;
	//set current node to one of the visited cities
	// * for all unvisited neighbors of current node, calculate distance and if smaller than their tentative distance, replace
	//once all neighbors calculated, mark current node as visited
	//if destination is visited, return its distance value
	//otherwise, set the node in the unvisited set with the smallest tentative distance as the current node, and go back to *
}


function rightRegion(num) {
	return num === 0 || num === 3
}

City.find({region: rightRegion})
.then(function (cities) {
	console.log(cities);
})