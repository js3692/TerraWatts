var mongoose = require('mongoose');
var Promise = require('bluebird');
var Grid = mongoose.model('Grid');
var Player = mongoose.model('Player');
var Game = mongoose.model('Game');
var User = mongoose.model('User');
var State = mongoose.model('State');

module.exports = function() {
    return Promise.all(['ourHero', 'hatesPuppies', 'drumpfinator'].map(username => {
        return User.findOne({username: username});
    })).then(function(users) {
        var colors = ['red', 'yellow', 'green'];
        return Promise.all(users.map((user, i) => {
            return Player.create({
                user: user,
                color: colors[i],
                clockwise: i
            });
        }));
    }).then(function(players) {
        var grid = new Grid({
            key: 'tour',
            name: 'tour',
            map: 'United States',
            regions: [2,4,5],
            maxPlayers: 3,
            players: players.map(player => player._id)
        });
        return grid.createGame();
    }).then(function(grid) {
        return grid.initialize();
    });
}
