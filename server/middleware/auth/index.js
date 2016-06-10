'use strict';

let jwt = require('jsonwebtoken');

let auth = {

  isLoggedIn: (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    res.loggedin = false;

    if (token) {
      jwt
        .verify(token, process.env.SECRET, function (error, decoded) {
          if (error) {
            return next();
          }

          res.loggedin = true;
          next();
        });
    }

    next();

  },

  authenticate: (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, process.env.SECRET, function (error, decoded) {
        if (error) {
          return res.status(403).json({ erroror: { message: 'Failed to authenticate token.' } });
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

module.exports = auth;
