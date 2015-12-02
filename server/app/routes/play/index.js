var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Current URL: 'api/play'

var Grid = mongoose.model('Grid');

var validations = require('../../../db/validations');

router.param('gridId', function(req, res, next, gridId){
  Grid.findById(gridId)
    .populate('players game state')
    .then(function (grid) {
      req.grid = grid;
      next();
    })
    .catch(next);
});

router.post('/continue/:gridId', function (req, res, next) {

	var passedGlobalValidations = validations.global.every(function(validationFunc) {
		return validationFunc(req.body, req.grid);
	});

	var passedSpecificValidations = validations[req.body.phase].every(function(validationFunc) {
		return validationFunc(req.body, req.grid);
	})

	if (!passedGlobalValidations || !passedSpecificValidations) {
		next(new Error({
			message: 'Game validation(s) failed',
			status: 400
		}));
	}

	req.grid.continue(req.body)
		.then(function () {
			res.sendStatus(201);
		});
});


// router.use('/plant/:gridId', require('./1_plant_phase'));

// router.use('/resource/:gridId', require('./2_resource_phase'));

// router.use('/city/:gridId', require('./3_city_phase'));

// router.use('/bureaucracy/:gridId', require('./4_bureaucracy_phase'));

module.exports = router;