// Instantiate all models
var Firebase = require('firebase');
var _ = require('lodash');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

require('../../../server/db/static-models');
require('../../../server/db/dynamic-models');

var User = mongoose.model('User');
var Grid = mongoose.model('Grid');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');
var State = mongoose.model('State');
var Plant = mongoose.model('Plant');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/grid-test';

var baseRef = new Firebase('https://amber-torch-6713.firebaseio.com/');

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Play Route: ', function () {
	var baseUrl = '/api/play/';

	beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

  after('Clear test database', function (done) {
    Player.remove()
      .then(function () {
        return Game.remove();
      })
      .then(function () {
        return State.remove();
      })
      .then(function () {
        return Grid.remove();
      })
      .then(function () {
        done();
      }).catch(done);
  });

  it('testing if tests test well', function () {
    console.log('Here until another describe is written');
  })

  describe('Game should be set up properly for each number of players: ', function () {
  	var purpleAgent = supertest.agent(app);
  	var yellowAgent = supertest.agent(app);
  	var greenAgent = supertest.agent(app);
  	var blueAgent = supertest.agent(app);
  	var redAgent = supertest.agent(app);
  	var blackAgent = supertest.agent(app);

  	var purpleUser = { username: 'Bush', email: 'bush@gmail.com', password: 'potus' };
  	var yellowUser = { username: 'Clinton', email: 'clinton@gmail.com', password: 'potus' };
  	var greenUser = { username: 'BushSr', email: 'bushsr@gmail.com', password: 'potus' };
  	var blueUser = { username: 'Reagan', email: 'reagan@gmail.com', password: 'potus' };
  	var redUser = { username: 'Carter', email: 'carter@gmail.com', password: 'potus' };
  	var blackUser = { username: 'Ford', email: 'ford@gmail.com', password: 'potus' };

    var firebaseKey;

  	before('Create all users and log them all in', function (done) {
  		function login (superagent, userinfo) {
  			return new Promise(function (resolve, reject) {
  				superagent.post('/login').send(userinfo).end(function (err, res) {
  					if (err) reject(err);
  					else resolve(res.body);
  				});
  			});
  		}

      User.create(purpleUser, yellowUser, greenUser, blueUser, redUser, blackUser)
        .then(function () {
      		return Promise.all([
      			login(purpleAgent, _.omit(purpleUser, 'email')),
      			login(yellowAgent, _.omit(yellowUser, 'email')),
      			login(greenAgent, _.omit(greenUser, 'email')),
      			login(blueAgent, _.omit(blueUser, 'email')),
      			login(redAgent, _.omit(redUser, 'email')),
      			login(blackAgent, _.omit(blackUser, 'email'))
      		]);
        })
        .then(function () {
          done();
        })
        .catch(done);
    });

  	after('Delete all users', function (done) {
  		var usernames = [purpleUser, yellowUser, greenUser, blueUser, redUser, blackUser].map(function (user) {
  			return user.username;
  		});
  		User.remove({ username: { $in: usernames } })
  			.then(function () {
          baseRef.child(firebaseKey).remove();
  				done();
  			}).catch(done);
  	});

  	describe('2 player game', function () {
      var gridId, purplePlayer, greenPlayer, stateActivePlayer, auctionActivePlayer;

      it('should instantiate the game properly', function (done) {
        purpleAgent
          .post('/api/grid')
          .send({
            name: "Game Test",
            map: 'United States',
            maxPlayers: 2,
            makeRandom: true,
            regions: [],
            color: 'purple'
          })
          .expect(201)
          .end(function (err, res) {
            if (err) done(err);
            expect(res.body.name).to.equal("Game Test");
            expect(res.body.state).to.be.a('null');
            expect(res.body.game).to.be.a('null');
            expect(res.body.players.length).to.equal(1);
            gridId = res.body.id;
            purplePlayer = res.body.players[0];
            firebaseKey = res.body.key;
            done();
          });
      });

      it('should allow another to join', function (done) {
        yellowAgent
          .post('/api/grid/before/' + gridId + '/join')
          .expect(201)
          .end(function (err, res) {
            if (err) done(err);
            done();
          });
      });

      it('should allow it to leave', function (done) {
        yellowAgent
          .post('/api/grid/before/' + gridId + '/leave')
          .expect(201)
          .end(done);
      });

      it('should allow new person to join', function (done) {
        greenAgent
          .post('/api/grid/before/' + gridId + '/join')
          .expect(201)
          .end(done);
      });

      it('should allow it to change color', function (done) {
        User.findOne({ username: greenUser.username })
          .then(function (foundUser) {
            greenAgent
              .put('/api/grid/before/' + gridId + '/color')
              .send({ userId: foundUser._id, color: 'blue' })
              .expect(200)
              .end(done);
          }).catch(done);
      });

      it('should start the game with those players', function (done) {
        purpleAgent
          .put('/api/grid/before/' + gridId + '/start')
          .expect(200)
          .end(function (err, res) {
            if (err) done(err);

            return Grid.findById(gridId).populate('players game state')
              .then(function (populatedGrid) {
                populatedGrid.deepPopulate([
                  'players.user',
                  // 'players.cities',
                  // 'players.plants',
                  // 'game.cities',
                  // 'game.connections',
                  // 'game.connections.cities',
                  'game.plantMarket',
                  'game.plantDeck',
                  // 'game.discardedPlants',
                  // 'game.stepThreePlants',
                  'game.turnOrder',
                  'game.turnOrder.user',
                  'state.auction'
                ], function(error, deepPopulatedGrid) {
                    if(error) done(error);
                    expect(deepPopulatedGrid.availableColors.indexOf('purple')).to.equal(-1)
                    expect(deepPopulatedGrid.availableColors.indexOf('blue')).to.equal(-1)
                    expect(deepPopulatedGrid.players.length).to.equal(2);
                    expect(deepPopulatedGrid.game.plantMarket.length).to.equal(8);
                    expect(deepPopulatedGrid.game.plantDeck.length).to.equal(26);
                    expect(deepPopulatedGrid.state.phase).to.equal('plant');
                    expect(deepPopulatedGrid.state.remainingPlayers.length).to.equal(2);
                    expect(deepPopulatedGrid.game.turnOrder[0]._id.equals(deepPopulatedGrid.state.activePlayer)).to.be.true;
                    greenPlayer = deepPopulatedGrid.players[1];
                    stateActivePlayer = deepPopulatedGrid.game.turnOrder[0];
                    done();
                });
              }).catch(done);
          });
      });

      it('should validate and proceed game with purple\'s move', function (done) {
        Plant.findOne({ rank: 4 })
          .then(function (plantFour) {
            purpleAgent
              .post('/api/play/plant/' + gridId + '/continue')
              .send({
                phase: 'plant',
                player: stateActivePlayer,
                data: {
                  plant: plantFour.toObject(),
                  bid: 4
                }
              })
              .expect(201)
              .end(function (err, res) {
                if (err) done(err);

                return Grid.findById(gridId).populate('players game state')
                  .then(function(populatedGrid){
                    populatedGrid.deepPopulate([
                      'players.user',
                      'players.cities',
                      // 'players.plants',
                      // 'game.cities',
                      // 'game.connections',
                      // 'game.connections.cities',
                      // 'game.plantMarket',
                      // 'game.plantDeck',
                      // 'game.discardedPlants',
                      // 'game.stepThreePlants',
                      'game.turnOrder',
                      'game.turnOrder.user',
                      'state.auction'
                    ], function(error, deepPopulatedGrid) {
                        if(error) done(error);
                        expect(!!deepPopulatedGrid.state.auction).to.be.true;
                        expect(deepPopulatedGrid.state.auction.bid).to.equal(4);
                        expect(deepPopulatedGrid.state.auction.remainingPlayers.length).to.equal(2);
                        expect(deepPopulatedGrid.state.auction.highestBidder.equals(stateActivePlayer._id)).to.be.true;

                        var highestBidderId = deepPopulatedGrid.state.auction.highestBidder;
                        var highestBidderIdx = _.findIndex(deepPopulatedGrid.players, player => player._id.equals(highestBidderId));
                        var nextPlayerIndex = (highestBidderIdx + 1) % 2;
                        expect(deepPopulatedGrid.state.auction.activePlayer.equals(deepPopulatedGrid.players[nextPlayerIndex]._id)).to.be.true;

                        auctionActivePlayer  = deepPopulatedGrid.state.auction.activePlayer;
                        done();
                    })
                  }).catch(done);
              });
          });
      });

      it('should validate and proceed game with green\'s move', function (done) {
        Player.findById(auctionActivePlayer)
          .then(function (foundPlayer) {
            auctionActivePlayer = foundPlayer;
            return Plant.findOne({ rank: 4 });
          })
          .then(function (plantFour) {
            greenAgent
              .post('/api/play/plant/' + gridId + '/continue')
              .send({
                phase: 'plant',
                player: auctionActivePlayer,
                data: {
                  plant: plantFour.toObject(),
                  bid: 6
                }
              })
              .expect(201)
              .end(function (err, res) {
                if (err) done(err);

                return Grid.findById(gridId).populate('players game state')
                  .then(function(populatedGrid){
                    populatedGrid.deepPopulate([
                      'players.user',
                      'players.cities',
                      // 'players.plants',
                      // 'game.cities',
                      // 'game.connections',
                      // 'game.connections.cities',
                      // 'game.plantMarket',
                      // 'game.plantDeck',
                      // 'game.discardedPlants',
                      // 'game.stepThreePlants',
                      'game.turnOrder',
                      'game.turnOrder.user',
                      'state.auction'
                    ], function(error, deepPopulatedGrid) {
                        if(error) done(error);
                        expect(!!deepPopulatedGrid.state.auction).to.be.true;
                        expect(deepPopulatedGrid.state.auction.bid).to.equal(6);
                        expect(deepPopulatedGrid.state.auction.remainingPlayers.length).to.equal(2);
                        expect(deepPopulatedGrid.state.auction.highestBidder.equals(auctionActivePlayer._id)).to.be.true;

                        var highestBidderId = deepPopulatedGrid.state.auction.highestBidder;
                        var highestBidderIdx = _.findIndex(deepPopulatedGrid.players, player => player._id.equals(highestBidderId));
                        var nextPlayerIndex = (highestBidderIdx + 1) % 2;
                        expect(deepPopulatedGrid.state.auction.activePlayer.equals(deepPopulatedGrid.players[nextPlayerIndex]._id)).to.be.true;
                        done();
                    })
                  }).catch(done);
              });
          });

      });

      it('should validate and proceed game with purple\'s decision to pass', function (done) {
        Plant.findOne({ rank: 4 })
          .then(function (plantFour) {
            purpleAgent
              .post('/api/play/plant/' + gridId + '/continue')
              .send({
                phase: 'plant',
                player: stateActivePlayer,
                data: 'pass'
              })
              .expect(201)
              .end(function (err, res) {
                if (err) done(err);

                return Grid.findById(gridId).populate('players game state')
                  .then(function(populatedGrid){
                    populatedGrid.deepPopulate([
                      'players.user',
                      'players.cities',
                      // 'players.plants',
                      // 'game.cities',
                      // 'game.connections',
                      // 'game.connections.cities',
                      // 'game.plantMarket',
                      // 'game.plantDeck',
                      // 'game.discardedPlants',
                      // 'game.stepThreePlants',
                      'game.turnOrder',
                      'game.turnOrder.user',
                      'state.auction'
                    ], function(error, deepPopulatedGrid) {
                        if(error) done(error);
                        console.log(deepPopulatedGrid);

                        deepPopulatedGrid

                        // Player who bought the plant is charged 6 and has the plant now
                        // Plant market doesn't have that plant anymore and is size 8, sorted correctly
                        // Player who passed should be the active player
                        // state's remainign player should not have the player that just bought htep lant
                        

                        // expect(!!deepPopulatedGrid.state.auction).to.be.true;
                        // expect(deepPopulatedGrid.state.auction.bid).to.equal(6);
                        // expect(deepPopulatedGrid.state.auction.remainingPlayers.length).to.equal(1);
                        // expect(deepPopulatedGrid.state.auction.highestBidder.equals(auctionActivePlayer._id)).to.be.true;

                        done();
                    })
                  }).catch(done);
              });
          });
      })


  	});

  });


});