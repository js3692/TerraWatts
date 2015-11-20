var router = require('express').Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');

// Current URL: 'api/user'

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (newUser) {
		res.json(newUser);
	})
	.then(null, next);
});

router.get('/:userId', function (req, res, next) {
	User.findById(req.params.userId)
	.then(function (user) {
		res.json(user);
	}, next);
});

module.exports = router;