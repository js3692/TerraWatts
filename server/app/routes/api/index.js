var router = require('express').Router();
module.exports = router;

router.use('/user', require('./userRouter'));
router.use('/grid', require('./gridRouter'));