'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST);

const UserModel = require('./modules/user/user.model');

module.exports = { UserModel };
