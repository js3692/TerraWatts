var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// var firebaseHelper = require("../../../../firebase");

// var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var Game = mongoose.model('Game');
var User = mongoose.model('User');

// Current URL: 'api/grid/before/:gridId'

router.get('/', function (req, res) {
    if(req.grid) res.json(req.grid);
});

router.post('/join', function (req, res, next) {
  req.grid.addPlayer({ user: req.user })
    .then(function (grid) {
      res.json(grid);
    })
    .catch(next);
});

router.post('/leave', function (req, res, next) {
  req.grid.removePlayer(req.user)
    .then(function (grid) {
      res.json(grid);
    })
    .catch(next);
});

router.put('/start', function(req, res, next) {
  Game.create({})
    .then(function (newGame) {
      return newGame.init(req.grid.map, req.grid.players, req.grid.regions)
    })
    .then(function (initializedGame) {
      req.grid.game = initializedGame;
      req.grid.state.go();
      return req.grid.save();
    })
    .then(function () {
        res.status(200).end();
    })
    .catch(next);
});
 
router.put('/changeColor', function(req, res, next){
  User.findById(req.body.userId)
    .then(function (user) {
      user.color = req.body.color;
      return user.save();
    })
    .then(function () {
      res.status(200).end();
    })
    .catch(next);
});

module.exports = router;