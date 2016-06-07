'use strict';

const Mongoose = require('mongoose').Mongoose;
const mongoose = new Mongoose();
const mockgoose = require('mockgoose');

before(done => {
  mockgoose(mongoose).then(() => {
    mongoose.connect(process.env.DB_HOST, done);
  });
});

after(() => {
  mockgoose.reset();
  mongoose.connection.close();
});
