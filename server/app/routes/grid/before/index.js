var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var router = require('express').Router();

var fbHelper = require('../../../../firebase');

var Game = mongoose.model('Game');
var Player = mongoose.model('Player');
var Region = mongoose.model('Region');

// Current URL: 'api/grid/before/:gridId'

router.get('/', function (req, res) {
  res.json(req.grid);
});

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
    .then(function (updatedGrid) {
      if(updatedGrid.players.length > 0) res.sendStatus(201);
      else return updatedGrid.remove().then(function () { 
          fbHelper.getConnection(req.grid.key).remove();
          res.sendStatus(201);
        });
    })
    .catch(next);
});

router.put('/start', function(req, res, next) {
  var gridToUse;

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

router.get('/regions', function (req, res, next) {
  Region.find({ map: req.grid.map })
    .then(function (regions) {
      res.json(regions);
    })
    .catch(next);
});

router.put('/regions', function (req, res, next) {
  req.grid.toggleRegion(req.body.regionId)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);
});

router.put('/color', function (req, res, next){
  Player.findOne({ user: req.body.userId })
    .then(function (foundPlayer) {
      return req.grid.switchColor(foundPlayer, req.body.color);
    })
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);
});

module.exports = router;