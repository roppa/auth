'use strict';

let homeRouter = require('express').Router();
let homeController = require('./home.controller');

homeRouter
  .get('/', homeController.get);

module.exports = homeRouter;
