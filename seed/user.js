var mongoose = require('mongoose');
var Promise = require('bluebird');
var User = Promise.promisifyAll(mongoose.model('User'));

var seedUsers = function () {

  var users = [
    {
      username: 'playerOne',
      email: 'testing1@fsa.com',
      password: 'password'
    },
    {
      username: 'playerTwo',
      email: 'testing2@fsa.com',
      password: 'password'
    },
    {
      username: 'playerThree',
      email: 'testing3@fsa.com',
      password: 'password'
    }
  ];

  return User.createAsync(users);

};

module.exports = seedUsers;