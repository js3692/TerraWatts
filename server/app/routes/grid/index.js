var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../firebase");

var fbRef = firebaseHelper.base();

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
        
        // grid.key is the id of the array element in firebase.
		grid.key = fbRef.push(grid.toObject()).key();
        firebaseHelper.setConnection(grid.key);
        return grid.save();
	})
    .then(function(grid){
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

router.param('gridId', function(req, res, next, gridId){
    Grid.findById(gridId)
        .then(function(grid){
            req.grid = grid;
            next();
        })
        .catch(next);
})

router.get('/:gridId', function (req, res, next) {
	if(req.grid) res.status(200).json(req.grid);
});

router.post('/:gridId/join', function (req, res, next) {
	req.grid.addUser(req.user)
	   .then(function (grid) {
            res.json(grid);
	   })
	   .catch(next);
});

 router.put('/:gridId/start', function(req, res, next) {
     
    req.grid.game = {hey: 'I am a game'};
    req.grid.save()
        .then(function (grid) {
            res.json(grid);
        }, next);
 })

module.exports = router;