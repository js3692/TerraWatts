var router = require('express').Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require("../../../firebase");

var fbRef = firebaseHelper.base();

var Grid = mongoose.model('Grid');
var User = mongoose.model('User');

// Current URL: 'api/grid'

router.post('/', function (req, res, next) {
	Grid.create({})
	.then(function (grid) {
		return grid.addUser(req.user);
	})
	.then(function (grid) {
		return Grid.populate(grid, "users");
    })
	.then(function(grid) {
        // grid.key is the id of the array element in firebase.
		grid.key = fbRef.push(grid.toObject()).key();
        res.status(201).json(grid);
        return grid.save();
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
        .populate('users')
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
        }).catch(next);
});

router.post('/:gridId/leave', function (req, res, next) {
	req.grid.removeUser(req.user)
		.then(function (grid) {
			res.json(grid);
		})
		.catch(next);
})

 router.put('/:gridId/start', function(req, res, next) {
     
     require('../../../game/init')(req.body)
        .then(function(newGame){
            req.grid.game = newGame;
            return req.grid.save();
        })
        .then(function(grid){
            res.status(200).end();
        })
        .catch(next);
 })
 
 router.put('/:gridId/changeColor', function(req, res, next){
     User.findById(req.body.userId)
        .then(function(user){
            user.color = req.body.color;
            return user.save();
        })
        .then(function(){
            return Grid.populate(req.grid, 'users')
        })
        .then(function(updatedGrid){
            updatedGrid.save()
            res.status(200).end() 
        })
        .catch(next);
 })

module.exports = router;