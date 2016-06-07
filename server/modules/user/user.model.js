'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const UserSchema = new Schema({
  username: { type: String, required: true, lowercase: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

let reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

UserSchema.virtual('isLocked').get(() => !!(this.lockUntil && this.lockUntil > Date.now()));

UserSchema.pre('save', function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      return next(error);
    }

    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }

      this.password = hash;
      next();
    });
  });

});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {

  bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });

};

UserSchema.methods.incLoginAttempts = function (callback) {

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, callback);
  }

  let updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.update(updates, callback);

};

UserSchema.statics.getAuthenticated = function (username, password, callback) {

  this.findOne({ username: username }, function (error, user) {

    if (error) return callback(error);

    if (!user) {
      return callback(null, null, reasons.NOT_FOUND);
    }

    if (user.isLocked) {
      return user.incLoginAttempts(function (error) {
        if (error) {
          return callback(error);
        }

        return callback(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    user.comparePassword(password, function (error, isMatch) {

      if (error) return callback(error);

      if (isMatch) {

        if (!user.loginAttempts && !user.lockUntil) {
          return callback(null, user);
        }

        let updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };

        return user.update(updates, function (error) {
          if (error) {
            return callback(error);
          }

          return callback(null, user);
        });

      }

      user.incLoginAttempts(function (error) {
        if (error) {
          return callback(error);
        }

        return callback(null, null, reasons.PASSWORD_INCORRECT);
      });
    });

  });

};

module.exports = mongoose.model('User', UserSchema);
