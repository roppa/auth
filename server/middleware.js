'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let auth = require('./middleware/auth');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static('../public'));
  app.use(morgan('dev'));
  app.use(auth.isLoggedIn);
  app.use('/', require('./router')); //setup all routes
};
