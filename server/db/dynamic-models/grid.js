var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var firebaseHelper = require('../../firebase');

var Region = mongoose.model('Region');
var Player = mongoose.model('Player');
var Game = mongoose.model('Game');
var State = mongoose.model('State');

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
      type: []
  },
});

// Only needed when there are virtuals
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.pre('save', function (next) {
  
  /* 
      Pushes grid (minus grid history) into grid.
  */
  
  // var gridSnapshot = _.omit(this.toObject(), ['history']);
  if(this.game) {
    this.history.push(this.game.toObject());

    firebaseHelper
      .getConnection(this.key) // ==> get connection to game
      .set(this.game.toObject());
  }
  
  /* 
      finds connection within connections hash
      then updates firebase game object.
  */
  
  next();
});

schema.methods.makeRandomRegions = function (numPlayers) {
  var self = this;
  Region.makeRandom(this.map, numPlayers)
    .then(function (selectedRegions) {
      self.regions = selectedRegions;
      return self.save();
    });
};

schema.methods.addPlayer = function (newPlayer) {

  if (this.game) throw new Error('The Game is already in play');

  if (this.players.length >= 6) throw new Error('The Game is already full');

  // if (this.players.some(player => {
  //   console.log(player);
  //   return player.user.equals(newPlayer.user)
  // })) return Promise.resolve(this);

  var colorIdx = this.availableColors.indexOf(newPlayer.color);
  this.availableColors.splice(colorIdx, 1);

	this.players.push(newPlayer);

	return this.save();
};

schema.methods.removePlayer = function (userId) {
  var self = this;

  console.log(userId, 'skldjflks')
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

  return Game.init(this.map, this.players, this.regions)
    .then(function (newGame) {
      self.game = newGame;
      return self.save();
    });
};

/*
schema.methods.init = function () {
  var self = this;
  this.state = new State();
  return this.state.init(this.game)
    .then(function (arr) {
      self.state = arr[0];
      self.game = arr[1];
      return self.save();
    })
};
*/

schema.method.continue = function () {
  
}

mongoose.model('Grid', schema);