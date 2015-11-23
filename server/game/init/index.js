var regions = require('./regions.js');
var Player = require('./player.js').createPlayer;
var mongoose = require('mongoose');
var City = mongoose.model('City');
var Plant = mongoose.model('Plant');
var Connection = mongoose.model('Connection');
var Promise = require('bluebird');
var Game = require('./game.js')

/* 
takes in array of players from the front end, returns a promise for a game object
players should come in as follows:
	[{user: user1, color: color2}, {user: user2, color: color2}, etc.]
*/
module.exports = function startGame(players) {
	var clockwiseOpts = [0,1,2,3,4,5].slice(0, players.length);
	players = players.map(function(player) {
		var clockwise = clockwiseOpts.splice(Math.random()*clockwiseOpts.length,1)[0];
		return new Player(player.user, player.color, clockwise);
	});

	var regionsInPlay = regions.randomize(players.length);
	var cityPromise = City.findByRegions(regionsInPlay);
	var connectionPromise = Connection.findByRegions(regionsInPlay);
	var plantPromise = Plant.find();
	return Promise.all([cityPromise, connectionPromise, plantPromise])
	.then(function(data) {
		var cities = data[0], connections = data[1], plants = data[2];
		return new Game(players, plants, cities, connections);
	})
}