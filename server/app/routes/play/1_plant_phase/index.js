var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var validations = require('../../../../db/validations');

// Current URL: 'api/play/plant/:gridId'

router.post('/continue', function (req, res, next) {
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

module.exports = router;