var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/play'

router.use('/plantState', require('./plantState'));
router.use('/resourceState', require('./resourceState'));
router.use('/cityState', require('./cityState'));
router.use('/endOfTurn', require('./endOfTurn'));

module.exports = router;

router.post('/:gridId...', function(req, res, next) {
	// find grid
	var update = req.body;
	// run validation functions
		// if any are false, respond with some error, and the game
		// if all true:
		grid.state.continue(update, grid.game)
		.then(function () {
			return grid.findById(req.grid._id)
		})
		.then(function (grid) {
			// save, fb stuff
			res.sendStatus(201);
		})

})