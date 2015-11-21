var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');
require('../db');
var City = mongoose.model('City');
var Connection = mongoose.model('Connection');

function totalConnectionCost(citiesToAdd, network, cities, connections) {
	var orders = permutations(citiesToAdd);
	var minCost = Infinity;
	orders.forEach(function (order) {
		var cost = 0;
		var networkCopy = network.slice();
		order.forEach(function (dest) {
			cost += cheapestDistanceTo(dest, networkCopy, cities, connections);
			networkCopy.push(dest);
		})
		if (cost < minCost) minCost = cost;
	})
	return minCost;
}

function cheapestDistanceTo(destination, network, cities, connections) {
	if(!network.length) return 0;

	var data = cities.map(function(city) {
		return {
			city: city,
			distance: containsCity(network, city) ? 0 : Infinity,
			visited: false
		}
	})

	var currentNode = _.find(data, function(node) {
		return !node.distance;
	})

	while(!getNode(destination, data).visited) {
		var connectionsToCurrent = connectionsTo(currentNode.city, connections);
		unvisitedNeighbors(currentNode, data, connectionsToCurrent).forEach(function (unvisitedNode) {
			var connectionCost = directConnection(currentNode, unvisitedNode, connections).distance;
			var tempDistance = currentNode.distance + connectionCost;
			if (tempDistance < unvisitedNode.distance) unvisitedNode.distance = tempDistance;
		})
		currentNode.visited = true;
		currentNode = getNewCurrent(data);
	}
	return getNode(destination, data).distance;
}

function containsCity(cities, city) {
	return !!_.find(cities, function(c) {
		return c._id.equals(city._id)
	})
}

function connectionsTo(city, connections) {
	return connections.filter(function (connection) {
		return containsCity(connection.cities, city);
	})
}

function unvisitedNeighbors(node, data, connectionsToNode) {
	var neighboringCities = connectionsToNode.map(function (connection) {
		return connection.cities.filter(function (city) {
			return !city._id.equals(node.city._id);
		})[0];
	})
	return data.filter(function (node) {
		return containsCity(neighboringCities, node.city) && !node.visited;
	})
}

function directConnection(node1, node2, connections) {
	return connectionsTo(node1.city, connections).filter(function (connection) {
		return containsCity(connection.cities, node2.city);
	})[0]
}

function getNode(city, data) {
	return _.find(data, function(node) {
		return node.city._id.equals(city._id);
	})
}

function getNewCurrent(data) {
	var unvisitedNodes = data.filter(function (node) {
		return !node.visited;
	})
	if (!unvisitedNodes) return;
	else {
		var minDist = Infinity;
		var newCurrent;
		unvisitedNodes.forEach(function (node) {
			if (node.distance < minDist) {
				newCurrent = node;
				minDist = node.distance;
			}
		})
		return newCurrent;
	}
}

function permutations(arr) {
	var perms = [];
	if(arr.length === 1) {
		perms.push(arr);
	} else {
		for (var i = 0, len = arr.length; i < len; i++) {
			var arrWithout = arr.slice(0,i).concat(arr.slice(i+1));
			permutations(arrWithout).forEach(function (perm) {
				perms.push([arr[i]].concat(perm));
			})
		}
	}
	return perms;
}

// the test:

// var regions = [0,3]
// Promise.all([City.findByRegions(regions), Connection.findByRegions(regions)])
// .then(function (data) {
// 	var cities = data[0];
// 	var connections = data[1];
// 	var network = [cities[0], cities[1]];
// 	var citiesToAdd = [cities[3], cities[4]];
// 	console.log(totalConnectionCost(citiesToAdd, network, cities, connections));
// });