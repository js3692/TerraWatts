var expect = require('chai').expect;
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

require('../../../server/db');

var Game = mongoose.model('Game');
var Region = mongoose.model('Region');

describe('init', function() {
 	beforeEach('Establish DB connection', function (done) {
 		if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
 	})

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('randomizes regions', function (done) {
    	Region.makeRandom('United States', 5)
    	.then(function (regions) {
    		expect(regions).to.have.length(5);
    		// console.log('5 players: ' +  regions);
    		done();
    	}, done);
    });

    it('inits the game object', function (done) {
    	var players = [
    		{user: 'abc', color: 'red'}, 
    		{user: 'def', color: 'blue'},
    		{user: 'ghi', color: 'green'},
    		{user: 'jkl', color: 'yellow'},
    		{user: 'mno', color: 'black'}
    	];
    	console.log('HERE');
    	Game.init('United States', players)
    	.then(function (game) {
    		console.log(game);
    		done();
    	}, done)

    })
})

describe('put up a plant', function() {

})

describe('buy resources', function() {

})

describe('buy cities', function() {

})

describe('end turn', function() {
	
})