var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// var firebaseHelper = require("../../../../firebase");

// var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

// Current URL: 'api/grid/before/:gridId'

router.post('/join', function (req, res, next) {
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
  var gridToUse;

  Grid.makeRandomRegions(req.grid.players.length)
    .then(function (grid) {
      gridToUse = grid;
      return Game.create({});
    })
    .then(function (newGame) {
      return newGame.init(gridToUse.map, gridToUse.players, gridToUse.regions)
    })
    .then(function (initializedGame) {
      req.grid.game = initializedGame;
      return req.grid.save();
    })
    .then(function (savedGrid) {
      return savedGrid.init();
    })
    .then(function () {
        res.status(202).end();
    })
    .catch(next);
});
 
router.put('/changeColor', function(req, res, next){
  Player.find({ user: req.body.userId })
    .then(function (foundPlayer) {
      req.grid.availableColors.push(foundPlayer.color);
      foundPlayer.color = req.body.color;
      return foundPlayer.save();
    })
    .then(function () {
      res.status(202).end();
    })
    .catch(next);
});

module.exports = router;