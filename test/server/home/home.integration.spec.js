'use strict';
require('dotenv').config({ silent: true });
let expect = require('chai').expect;
let request = require('supertest');
request = request(`${process.env.HOST}:${process.env.PORT}`);

describe('Auth endpoints', () => {

  it('should have a home page', (done) => {
    request
      .get('/')
      .end(function (error, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

});
