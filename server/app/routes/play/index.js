var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../firebase");
var validations = require('../../../db/validations');

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/play'

router.use('/plantState', require('./plantState'));
router.use('/resourceState', require('./resourceState'));
router.use('/cityState', require('./cityState'));
router.use('/endOfTurn', require('./endOfTurn'));

router.post('/:gridId/continue', function(req, res, next) {
	var passedGlobalValidations = validations.global.every(function(validationFunc) {
		return validationFunc(req.body, req.grid);
	});
	var passedSpecificValidations = validations[req.body.phase].every(function(validationFunc) {
		return validationFunc(req.body, req.grid);
	})
	if (!passedGlobalValidations || !passedSpecificValidations) res.sendStatus(400);

	req.grid.state.continue(req.body, req.grid.game)
	.then(function () {
		return Grid.findById(req.grid._id)
	})
	.then(function (grid) {
		// save, fb stuff
		res.sendStatus(201);
	})

})

module.exports = router;