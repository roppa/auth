'use strict';
require('dotenv').config({ silent: true });
let expect = require('chai').expect;
let request = require('supertest');
let http_mocks = require('node-mocks-http');
request = request(`${process.env.HOST}:${process.env.PORT}`);

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter});
}

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
