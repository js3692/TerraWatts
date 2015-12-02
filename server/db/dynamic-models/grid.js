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
      type: [Object]
  },
});

// For the "id" virtual
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.pre('save', function (next) {
  // POPULATE FIELDS BEFORE SENDING

  // This is mainly for '/join' and '/leave' of players
  firebaseHelper
    .getConnectionToPlayers(this.key)
    .set(this.players.toObject());

  firebaseHelper
    .getConnection
    .set({
      "players": this.players.toObject()
    })

  // This means the game was initizlied and started
  if(this.game) {
    this.history.push(this.game.toObject());

    firebaseHelper
      .getConnectiontoGame(this.key)
      .set(this.game.toObject());

    firebaseHelper
      .getConnectiontoState(this.key)
      .set(this.state.toObject());
  }

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

  return Game.init(this.map, this.players, this.regions)
    .then(function (newGame) {
      self.game = newGame;
      return self.save();
    });
};

schema.methods.init = function () {
  var self = this;
  this.state = new State();
  return this.state.init(this.game)
    .then(function (savedStateAndGame) {
      self.state = savedStateAndGame[0];
      self.game = savedStateAndGame[1];
      return self.save();
    })
};

schema.method.continue = function () {
  // this.state.continue(update, game)
};

mongoose.model('Grid', schema);