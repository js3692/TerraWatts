var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var validations = require('../../../../db/validations');

// Current URL: 'api/play/plant/:gridId'

router.post('/continue', function (req, res, next) {

	var isValid = true;

	var validationsToUse = validations.global.concat(validations[req.body.phase]);

	validationsToUse.forEach(function (validation) {
		if (isValid && !validation.func(req.body, req.grid)) {
			isValid = false;
			var err = new Error(validation.message);
			err.status = 400;
			next(err);
		}
	});

	if (isValid) {
		console.log('heyheyheyheyheyheyheyheyheyheyheyheyheyheyheyheyheyheyheyhey')
    req.grid.continue(req.body)
      .then(function () {
        res.sendStatus(201);
      });
  }
});

module.exports = router;