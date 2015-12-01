var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');
var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

require('../../../server/db');

var Game = mongoose.model('Game');
var Region = mongoose.model('Region');
var State = mongoose.model('State');
var Player = mongoose.model('Player');
var User = mongoose.model('User');
var Plant = mongoose.model('Plant');
var Auction = mongoose.model('Auction');

describe('game', function() {
 	beforeEach('Establish DB connection', function (done) {
 		if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
 	})

 	var users;
	var players;
	beforeEach('grab some users', function(done) {
		User.find()
		.then(function(_users) {
			users = _users.slice(0,3);
			done();
		}, done)
	})

	beforeEach('create some players', function(done) {
		var promises = ['red', 'blue', 'green'].map(function(color, i) {
			return Player.create({user: users[i], color: color, clockwise: i});
		});
		Promise.all(promises)
		.then(function(_players) {
			players = _players;
			done();
		}, done);
	})

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    var regions;
    it('randomizes regions', function (done) {
    	Region.makeRandom('United States', 3)
    	.then(function (_regions) {
    		regions = _regions;
    		expect(regions).to.have.length(3);
    		// console.log('5 players: ' +  regions);
    		done();
    	}, done);
    });

    var game;
    it('inits the game object', function (done) {
    	game = new Game();
    	game.init('United States', players, regions)
    	.then(function (_game) {
    		game = _game;
    		// console.log(game);
    		done();
    	}, done)
    })

    var state;
    it('inits a plant step', function (done) {
    	state = new State();
    	state.init(game)
    	.then(function (arr) {
			state = arr[0];
			game = arr[1]
			// console.log('state', state);
			// console.log('game', game);
			done();
		}, done)
    })

    it('starts an auction when it should', function (done) {
    	var update = {
    		player: players[0],
    		data: {
    			plant: game.plantMarket[0],
    			bid: 4
    		}
    	}
    	state.continue(update, game)
    	.then(function (auction) {
    		expect(auction[0]).to.equal('auction');
    		console.log(auction)
    		done();
    	})
    })

    it('handles a pass', function (done) {
    	var update = {
    		player: players[0],
    		data: 'pass'
    	}
    	state.continue(update, game)
    	.then(function (arr) {
    		state = arr[0];
    		game = arr[1];
    		expect(state.remainingPlayers).to.have.length(2);
    		// console.log(state.remainingPlayers);
    		// console.log(state.activePlayer);
    		done();
    	})
    })

    it('transitions to next state', function (done) {
    	function update(num) {
    		return {
    			player: players[num],
    			data: 'pass'
    		}
    	}
    	state.continue(update(1), game)
    	.then(function (arr) {
    		return arr[0].continue(update(2), arr[1])
    	})
    	.then(function (arr) {
    		state = arr[0];
    		game = arr[1];
    		expect(state.phase).to.equal('resource');
    		done()
    	})
    })
})

describe('auction', function() {
	beforeEach('Establish DB connection', function (done) {
 		if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
 	})

 	var users;
	var players;
	beforeEach('grab some users', function (done) {
		User.find()
		.then(function(_users) {
			users = _users.slice(0,3);
			done();
		}, done)
	})

	var plant;
	beforeEach('grab a plant', function (done) {
		Plant.find()
		.then(function (_plants) {
			plant = _plants[3];
			done()
		}, done)
	})

	beforeEach('create some players', function(done) {
		var promises = ['red', 'blue', 'green'].map(function(color, i) {
			return Player.create({user: users[i], color: color, clockwise: i});
		});
		Promise.all(promises)
		.then(function(_players) {
			players = _players;
			done();
		}, done);
	})

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    var state = new State({remainingPlayers: players});

    it('inits auction', function(done) {
    	state.auction = new Auction({
    		plant: plant,
    		bid: plant.rank,
    		plantState: state
    	});
    	state.auction.init()
    	.then(function (auction) {
    		console.log(auction);
    		done()
    	})
    })
})

describe('buy resources', function() {

})

describe('buy cities', function() {

})

describe('end turn', function() {
	
})