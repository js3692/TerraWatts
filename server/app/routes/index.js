'use strict';
var router = require('express').Router();
module.exports = router;

// Current URL: '/api'

router.use('/members', require('./members'));
router.use('/user', require('./user'));
router.use('/grid', require('./grid'));
router.use('/play', require('./play'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
  res.status(404).end();
});