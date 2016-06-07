'use strict';

let homeController = {

  get: (req, res) => {
    res.render('home', { loggedin: res.loggedin });
  }

};

module.exports = homeController;
