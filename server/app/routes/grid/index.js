var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Firebase = require("firebase");

var fbRef = new Firebase("https://glowing-torch-8958.firebaseio.com/");

var Grid = mongoose.model('Grid');

// Current URL: 'api/grid'

router.post('/', function (req, res, next) {
	Grid.create({})
	.then(function (grid) {
		return grid.addUser(req.user);
	})
	.then(function (grid) {
		return grid.populate("users");
	})
	.then(function(grid) {
		fbRef.push(grid.toObject());
		res.sendStatus(201);
	})
	.catch(next);
});

router.get('/canjoin', function (req, res, next) {
	Grid.getJoinable()
	.then(function (joinableGrids) {
		res.json(joinableGrids);
	})
	.catch(next);
});

router.get('/:gridId', function (req, res, next) {
	Grid.findById(req.params.gridId).populate('users')
	.then(function (grid) {
		res.sendStatus(200);
	})
	.catch(next);
});

router.post('/:gridId/join', function (req, res, next) {
	Grid.findById(req.params.gridId)
	.then(function (grid) {
		return grid.addUser(req.user);
	})
	.then(function (grid) {
		res.json(grid);
	})
	.catch(next);
});

// router.put('/:gridId/start', function(req, res, next) {
// 	Grid.findById(req.params.gridId)
// 	.then(function (grid) {
// 		//user Game constructor here instead of using dummy object
// 		grid.game = {hey: 'I am a game'};
// 		return grid.save();
// 	})
// 	.then(function (grid) {
// 		res.json(grid);
// 	}, next);
// });

module.exports = router;