'use strict';

let expect = require('chai').expect;
let mongoose = require('mongoose');
let mockgoose = require('mockgoose');
let UserModel = require('../../../server/modules/user/user.model');

describe('User model', () => {

  before(done => {
    mockgoose(mongoose).then(() => {
      mongoose.connect(process.env.DB_HOST, (err) => {
        done(err);
      });
    });
  });

  afterEach(done => {
    mockgoose.reset(done);
  });

  it('should be mocked', () => {
    expect(mongoose.isMocked).to.be.ok;
  });

  it('should not create a user with no password', done => {

    let userData = {
      username: 'test',
      password: ''
    };

    UserModel
      .create(userData, (error, user) => {
        expect(error).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });

  });

  it('should create a user', done => {

    let userData = {
      username: 'test',
      password: 'test'
    };

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          done(error);
        }

        expect(user).to.be.ok;
        done();
      });

  });

  it('should compare exact passwords successfully', done => {

    let userData = {
      username: 'test',
      password: 'test'
    };

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          done(error);
        }

        user.comparePassword('test', (error, match) => {
          expect(error).to.not.be.ok;
          expect(match).to.be.ok;
          expect(match).to.eql(true);
          done();
        });

      });

  });

  it('should compare different passwords unsuccessfully', done => {

    let userData = {
      username: 'test',
      password: 'test'
    };

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          done(error);
        }

        user.comparePassword('password', (error, match) => {
          expect(error).to.not.be.ok;
          expect(match).to.not.be.ok;
          expect(match).to.eql(false);
          done();
        });

      });

  });

  it('should authenticate a user', done => {

    let userData = {
      username: 'test',
      password: 'test'
    };

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          done(error);
        }

        UserModel
          .getAuthenticated(userData.username, userData.password, (error, user, code) => {
            expect(error).to.not.be.ok;
            expect(user).to.be.ok;
            expect(code).to.not.be.ok;
            done();
          });

      });

  });

  it('should not authenticate an invalid user', done => {

    UserModel
      .getAuthenticated("bobjohnson", "password", (error, user, code) => {
        expect(error).to.not.be.ok;
        expect(user).to.not.be.ok;
        expect(code).to.not.be.ok;
        expect(code).to.eql(0);
        done();
      });

  });

  it('should increment login attempts', done => {

    let userData = {
      username: 'test',
      password: 'test'
    };

    UserModel
      .create(userData, (error, user) => {
        if (error) {
          done(error);
        }

        let promises = [];

        for (let i = 0; i < 5; i++) {
          promises.push(new Promise((resolve, reject) => {
            UserModel
              .getAuthenticated(userData.username, "password", (error, user, code) => {
                if (error) {
                  return reject(error);
                }
                resolve();
              });
          }));
        }

        Promise
          .all(promises)
          .then(values => {
            UserModel
              .getAuthenticated(userData.username, userData.password, (error, user, code) => {
                if (error) {
                  return done(error);
                }

                expect(user).to.be.ok;
                expect(user.loginAttempts).to.eql(5);
                done();
              });
          });

      });
  });

  it('should lock account on max login attempts', () => {

  });

});
