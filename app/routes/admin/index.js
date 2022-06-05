var express = require('express');
var router = express.Router();

router.use('/user',require('./user'));
router.use('/section',require('./section'));
router.use('/announcement',require('./announcement'));
router.use('/appUser',require('./appUser'));
router.use('/topic',require('./topic'));

module.exports = router;