var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var validations = require('../../../db/validations');

var Grid = mongoose.model('Grid');

// Current URL: 'api/play'

router.use(function (req, res, next) {
	if(req.body.player.user._id === req.user.id) next();
	else {
		var err = new Error('Hey, you are not the player who just made the move');
		err.status = 403;
		next(err);
	}
})

router.param('gridId', function(req, res, next, gridId) {
  var fieldsToDeepPopulate = ['players.user', 'players.cities', 'players.plants',
  'game.cities', 'game.connections.cities', 'game.plantMarket', 'game.plantDeck',
  'game.discardedPlants', 'game.stepThreePlants', 'game.turnOrder.user',
  'game.turnOrder.plants', 'state.auction'];

  Grid.findById(gridId).deepPopulate(fieldsToDeepPopulate).exec()
    .then(function(deepPopulatedGrid){
      req.grid = deepPopulatedGrid;
      next(); 
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
  });

  if (isValid) {
    req.grid.continue(req.body)
      .then(function () {
        res.sendStatus(201);
      }).catch(next);
  }
});

module.exports = router;