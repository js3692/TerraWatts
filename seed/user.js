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
    },
    {
      username: 'ourHero',
      email: 'you@you.you',
      password: 'willanyoneeverguessthispassword'
    },
    {
      username: 'hatesPuppies',
      email: 'hates@puppies.puppy',
      password: 'willanyoneeverguessthispassword'
    },
    {
      username: 'drumpfinator',
      email: 'donald@trump.trump',
      password: 'willanyoneeverguessthispassword'
    }
  ];

  return User.createAsync(users);

};

module.exports = seedUsers;
