var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var router = require('express').Router();
// var firebaseHelper = require("../../../../firebase");

// var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

// Current URL: 'api/grid/before/:gridId'

router.get('/', function (req, res) {
  res.json(req.grid);
});

router.post('/join', function (req, res, next) {
    console.log('in her', req.grid)
  Player.create({ user: req.user, color: req.grid.availableColors[0] })
    .then(function (newPlayer) {
      return req.grid.addPlayer(newPlayer);
    })
    .then(function () {
      res.sendStatus(201);
    })
    .catch(next);
});

router.post('/leave', function (req, res, next) {
  req.grid.removePlayer(req.user)
    .then(function () {
      res.sendStatus(201);
    })
    .catch(next);
});

router.put('/start', function(req, res, next) {
  var gridToUsePromise, gridToUse;

//  if (req.grid.randomRegions) gridToUsePromise = req.grid.makeRandomRegions(req.grid.players.length);
//  else gridToUsePromise = Promise.resolve(req.grid);
  
  Promise.resolve(req.grid.randomRegions ? req.grid.makeRandomRegions(req.grid.players.length) : req.grid)
    .then(function (grid) {
      gridToUse = grid;
      return Game.create({});
    })
    .then(function (newGame) {
      return newGame.initialize(gridToUse.map, gridToUse.players, gridToUse.regions)
    })
    .then(function (initializedGame) {
      req.grid.game = initializedGame;
      return req.grid.initialize();
    })
    .then(function () {
        res.sendStatus(200);
    })
    .catch(next);
});
 
router.put('/color', function(req, res, next){
  Player.findOne({ user: req.body.userId })
    .then(function (foundPlayer) {
      return req.grid.switchColor(foundPlayer, req.body.color);
    })
    .catch(next);
});

module.exports = router;