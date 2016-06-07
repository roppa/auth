'use strict';

let userRouter = require('express').Router({mergeParams: true});
let userController = require('./user.controller');

userRouter
  .get('/', userController.verify, userController.getUser)
  .post('/', userController.create)
  .post('/authenticate', userController.authenticate);

module.exports = userRouter;
