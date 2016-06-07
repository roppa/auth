'use strict';
let expect = require('chai').expect;
let request = require('supertest');
request = request('http://localhost:3000');

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
