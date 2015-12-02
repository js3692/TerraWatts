var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Current URL: 'api/play'

var Grid = mongoose.model('Grid');

var validations = require('../../../db/validations');

router.param('gridId', function(req, res, next, gridId){
  Grid.findById(gridId)
    .populate('players game state')
    .then(function(populatedGrid){
        populatedGrid.deepPopulate([
          'players.user',
          'players.cities',
          'players.plants',
          'game.cities',
          'game.connections',
          'game.connections.cities',
          'game.plantMarket',
          'game.plantDeck',
          'game.discardedPlants',
          'game.stepThreePlants',
          'game.turnOrder',
          'game.turnOrder.user'
        ], function(err, deepPopulatedGrid) {
            if(err) next(err);
              req.grid = deepPopulatedGrid;
              next(); 
        })
    })
    .catch(next);
});

router.post('/continue/:gridId', function (req, res, next) {
	var isValid = true;
	var validationsToUse = validations.global.concat(validations[req.body.phase]);
	validationsToUse.forEach(function (validation) {
		if (isValid && !validation.func(req.body, req.grid)) {
			isValid = false;
			var err = new Error(validation.message);
			err.status = 400;
			next(err);
		}
	})
	if (isValid) {
        req.grid.continue(req.body)
            .then(function () {
                res.sendStatus(201);
            });
    }
});


// router.use('/plant/:gridId', require('./1_plant_phase'));

// router.use('/resource/:gridId', require('./2_resource_phase'));

// router.use('/city/:gridId', require('./3_city_phase'));

// router.use('/bureaucracy/:gridId', require('./4_bureaucracy_phase'));

module.exports = router;