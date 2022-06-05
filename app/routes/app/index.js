var express = require('express');
var router = express.Router();

router.use('/user',require('./user'));
router.use('/home',require('./home'));
router.use('/upload',require('./upload'));

module.exports = router;