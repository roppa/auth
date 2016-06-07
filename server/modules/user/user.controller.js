'use strict';

let UserModel = require('../../db').UserModel;
let jwt = require('jsonwebtoken');

let userController = {

  getUser: (req, res) => {
    res.send('User page');
  },

  create: (req, res) => {

    let userData = req.body;

    if (!userData.username || !userData.password) {
      return res.json({ error: { message: 'Make sure you have entered a username and password' } });
    }

    userData.username = userData.username.toLowerCase();

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          return res.json(error);
        }

        res.json({ message: user.username });
      });

  },

  authenticate: (req, res) => {

    let userData = req.body;

    if (!userData.username || !userData.password) {
      return res.json({ error: { message: 'Make sure you have entered a username and password' } });
    }

    userData.username = userData.username.toLowerCase();

    UserModel
      .getAuthenticated(userData.username, userData.password, (error, user, code) => {

        if (code === 2) {
          res.json({ error: { message: 'Your account is locked, please try later' } });
        }

        if (error) {
          res.json({ error: { message: 'Error authenticating.' } });
        } else {

          let token = jwt.sign(user, process.env.SECRET, {
            expiresInMinutes: 1440 // 24 hours
          });

          res.json({
            success: true,
            message: 'Success',
            token: token
          });

        }
      });

  },

  verify: (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          return res.json({ error: { message: 'Failed to authenticate token.' } });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({ error: { message: 'No token!' } });
    }

  }

};

module.exports = userController;
