'use strict';

let router = require('express').Router();

router.use('/', require('./modules/home/home.router'));
router.use('/user', require('./modules/user/user.router'));

module.exports = router;
