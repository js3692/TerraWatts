var router = require('express').Router();
var mongoose = require('mongoose');

var Grid = mongoose.model('Grid');

router.get('/canjoin', function (req, res, next) {
	Grid.getJoinable()
	.then(function (joinableGrids) {
		res.json(joinableGrids);
	})
})

router.get('/:gridId', function (req, res, next) {
	Grid.findById(req.params.gameId).populate('users')
	.then(function (grid) {
		res.json(grid);
	}, next)
})

router.post('/', function (req, res, next) {
	Grid.create({})
	.then(function (grid) {
		grid.addUser(req.user);
		return grid.save()
	})
	.then(function (grid) {
		res.json(grid);
	}, next)
})

router.post('/:gridId/join', function (req, res, next) {
	Grid.findById(req.params.gridId)
	.then(function (grid) {
		grid.addUser(req.user);
		return grid.save();
	})
	.then(function (grid) {
		res.json(grid);
	}, next)
})

router.put('/:gridId/start', function(req, res, next) {
	Grid.findById(req.params.gridId)
	.then(function (grid) {
		//user Game constructor here instead of using dummy object
		grid.game = {hey: 'I am a game'}
		return grid.save();
	})
	.then(function (grid) {
		res.json(grid);
	}, next)
})

module.exports = router;