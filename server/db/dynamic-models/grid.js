var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var firebaseHelper = require('../../firebase');

var Region = mongoose.model('Region');
var Player = mongoose.model('Player');
var Game = mongoose.model('Game');
var State = mongoose.model('State');

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var schema = new mongoose.Schema({
  // Below are game ENVIRONMENT settings
  key: {
    type: String
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  map: {
    type: String,
    enum: ['United States', 'Germany', 'China', 'South Korea']
  },
  regions: {
    type: [Number]
  },
  randomRegions: {
    type: Boolean
  },
  maxPlayers: {
    type: Number,
    enum: [2, 3, 4, 5, 6]
  },
  availableColors: {
    type: [String],
    default: ['yellow', 'green', 'blue', 'red', 'black', 'purple']
  },
  // Below are references to each COMPONENT of the game environment
  players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  }],
  game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      default: null
  },
  state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      default: null
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    default: null
  },
  // Below are HISTORICAL data relevant to this game environment
  complete: {
      type: Boolean,
      default: false
  },
  history: {
      type: [Object]
  },
});

schema.plugin(deepPopulate, {
  whitelist: [
    'players.user',
    'players.cities',
    'players.plants',
    'game.cities',
    'game.connections',
    'game.connections.cities',
    'game.plantMarket',
    'game.plantDeck',
    'game.discardedPlants',
    'game.stepThreePlants',
    'game.turnOrder',
    'game.turnOrder.user',
    'game.turnOrder.plants',
    'state.auction'
  ],
  populate: {
    'players.user': {
      select: 'username'
    }
  }
})

// For the "id" virtual
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.post('save', function (grid) {
  if(grid.players.length > 0) {
    grid.constructor
      .populate(grid, 'game state players auction')
      .then(function (populatedGrid){
        populatedGrid.deepPopulate([
          'players.user',
          'players.cities',
          'players.plants',
          'game.cities',
          'game.connections',
          'game.connections.cities',
          'game.plantMarket',
          'game.plantDeck',
          'game.discardedPlants',
          'game.stepThreePlants',
          'game.turnOrder',
          'game.turnOrder.user',
          'state.auction'
        ], function(err, deepPopulatedGrid) {
          if(err) throw err;
          // This is mainly for '/join' and '/leave' of players
          firebaseHelper
            .getConnection(deepPopulatedGrid.key)
            .update({
                'players': deepPopulatedGrid.players.map(player => player.toObject())
            });

          // This means the game was initialized and started
          if(deepPopulatedGrid.game) {
            firebaseHelper
              .getConnection(deepPopulatedGrid.key)
              .update({
                'game': deepPopulatedGrid.game.toObject()
              });

            firebaseHelper
              .getConnection(deepPopulatedGrid.key)
              .update({
                'state': deepPopulatedGrid.state.toObject()
              });
            }

        })
      })
  }
});

//schema.methods.saveHistory = function () {
//  this.history.push(this.game.toObject());
//};

schema.methods.makeRandomRegions = function (numPlayers) {
  var self = this;
  return Region.makeRandom(this.map, numPlayers)
    .then(function (selectedRegions) {
      self.regions = selectedRegions.map(region => region.regionId);
      return self.save();
    });
};

schema.methods.addPlayer = function (newPlayer) {

  if (this.game) throw new Error('The Game is already in play');

  if (this.players.length >= 6) throw new Error('The Game is already full');

  if (this.players.some(player => player.user.equals(newPlayer.user))) throw new Error('The Player is already in the game')

  var colorIdx = this.availableColors.indexOf(newPlayer.color);
  this.availableColors.splice(colorIdx, 1);

	this.players.push(newPlayer);

	return this.save();
};

schema.methods.removePlayer = function (userId) {
  var self = this;

  return Player.findOne({ user: userId })
    .then(function (foundPlayer) {
    	var playerIdx = self.players.indexOf(foundPlayer._id);
    	self.players.splice(playerIdx, 1);
      self.availableColors.push(foundPlayer.color);
      return foundPlayer.remove();
    })
    .then(function () {
    	return self.save();
    });
};

schema.methods.switchColor = function (player, newColor) {
  if (player.color === newColor) throw new Error('You already own that color');

  var self = this;
  var oldColor = player.color;
  player.color = newColor;

  return player.save()
    .then(function () {
      self.availableColors.push(oldColor);
      self.availableColors.pull(newColor);
    })
    .then(function () {
      return self.save();
    });
};

schema.methods.createGame = function () {
  var self = this;

  return Game.initialize(this.map, this.players, this.regions)
    .then(function (newGame) {
      self.game = newGame;
      return self.save();
    });
};

schema.methods.initialize = function () {
  var self = this;
  this.state = new State();
  return this.state.initialize(this.game)
    .then(function (savedStateAndGame) {
      self.state = savedStateAndGame[0];
      self.game = savedStateAndGame[1];
      return self.save();
    })
};

schema.methods.continue = function (update) {
  var self = this;
  if(this.state.choice) {
    return this.state.choice.continue(update, this.game)
    .then(function (whatContinueReturns) {
      self.game = whatContinueReturns[1];
      return self.save();
    })
  } else if(this.state.auction) {
    return this.state.auction.continue(update, this.game)
    .then(function () {
        return self.save();
    })
  } else {
    return this.state.continue(update, this.game)
    .then(function (whatContinueReturns) {
      if(whatContinueReturns.length) self.game = whatContinueReturns[1];
      console.log('!!!!!!!!!!!!!!!!', self.game);
      return self.save();
    })
  }
};

mongoose.model('Grid', schema);