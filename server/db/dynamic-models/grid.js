var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

var _ = require('lodash');

var firebaseHelper = require('../../firebase');

var Region = mongoose.model('Region');
var Player = mongoose.model('Player');
var Game = mongoose.model('Game');
var State = mongoose.model('State');

var regionRules = require('../utils/0_basic_rules/dependsOnNumPlayers.js').numRegions;

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
    type: Boolean,
    default: false
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
  // Below are HISTORICAL data relevant to this game environment
  complete: {
      type: Boolean,
      default: false
  },
  history: {
      type: [Object]
  },
});

var fieldsToPopulate = [
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
    'state.auction',
    'state.activePlayer',
    'state.activePlayer.user',
    'state.auction.activePlayer',
    'state.auction.activePlayer.user',  
    'state.auction.remainingPlayers', 
    'state.auction.remainingPlayers.user', 
    'state.auction.plant',
    'state.auction.choice',
    'state.auction.choice.player',
    'state.auction.choice.player.user'
    
  ];

schema.plugin(deepPopulate, {
  whitelist: fieldsToPopulate,
  populate: {
    'players.user': {
      select: 'username'
    },
    'game.turnOrder.user': {
      select: 'username'
    }
  }
});

// For the "id" virtual
schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

schema.post('save', function (grid) {
  if(grid.players.length > 0) {
    grid.constructor
      .populate(grid, 'game state players')
      .then(function (populatedGrid){
        populatedGrid.deepPopulate(fieldsToPopulate, function(err, deepPopulatedGrid) {
         
          if(err) throw err;
          // This is mainly for '/join' and '/leave' of players
          // console.log(deepPopulatedGrid.availableColors);
          firebaseHelper
            .getConnection(deepPopulatedGrid.key)
            .update({
              'availableColors': deepPopulatedGrid.availableColors.slice()
            });

          firebaseHelper
            .getConnection(deepPopulatedGrid.key)
            .update({
              'regions': deepPopulatedGrid.regions.slice()
            });
            
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

          // firebaseHelper.disconnect(deepPopulatedGrid.key);

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

  this.availableColors.pull(newPlayer.color);
	this.players.push(newPlayer);

	return this.save();
};

schema.methods.removePlayer = function (userId) {
  var self = this;

  return Player.findOne({ user: userId })
    .then(function (foundPlayer) {
    	var playerIdx = _.findIndex(self.players, player => player._id.equals(foundPlayer._id));
      self.players.splice(playerIdx, 1);
      self.availableColors.push(foundPlayer.color);
      self.markModified('availableColors');
      return foundPlayer.remove();
    })
    .then(function () {
    	return self.save();
    });
};

schema.methods.validateRegionForSelection = function (regionId) {
  return Region.find({ map: this.map, regionId: { $in: this.regions } })
    .then(function (regionsInPlay) {
      var adjacent = regionsInPlay.reduce(function (prev, next) { return _.union(prev, next.adjacent); }, []);
      if(adjacent.indexOf(regionId) === -1) return false;
      else return true;
    });
};

schema.methods.validateRegionForRemoval = function () {
  if(this.regions && this.regions.length === 1) return Promise.resolve(true);
  return Region.find({ map: this.map, regionId: { $in: this.regions } })
    .then(function (regionsInPlay) {
      var regionIds = regionsInPlay.map(function (elem) { return elem.regionId; });
      return regionsInPlay.every(function (elem) {
        return regionIds.some(function (regionId) {
          return elem.adjacent.indexOf(regionId) > -1;
        });
      });
    });
}

schema.methods.toggleRegion = function (regionId) {

  var maxNumber = regionRules[this.players.length];
  if (maxNumber < 3) maxNumber = 3; // If only one person is in the lobby, assume two players

  var idx = this.regions.indexOf(regionId);

  var self = this;

  if (idx > -1) {
    var temp = this.regions.splice(idx, 1)[0];
    return this.validateRegionForRemoval()
      .then(function (validRemoval) {
        if(!validRemoval) self.regions.push(temp);
        return self.save();
      });
  } else if (idx === -1) {
    if(this.regions && this.regions.length > 0) {
      if(self.regions.length === maxNumber) return Promise.resolve();
      return this.validateRegionForSelection(regionId)
        .then(function (validSelection) {
          if(validSelection) self.regions.push(regionId);
          else {
            if(temp) self.regions.push(temp);
          }
          return self.save();
        })
    } else {
      this.regions.push(regionId);
      return this.save();
    }
  }

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
  this.state = new State({key: this.key});
  return Player.find({ _id: {$in: this.players}})
  .then(function (players) {
    var promises = [];
    players.forEach(function (player, i) {
      player.clockwise = i;
      promises.push(player.save())
    })
    return Promise.all(promises)
  })
  .then(function () {
    return self.state.initialize(self.game)
  })
  .then(function (savedStateAndGame) {
    self.state = savedStateAndGame[0];
    self.game = savedStateAndGame[1];
    return self.save();
  })
};

schema.methods.continue = function (update) {
  var self = this;
  if(this.state.auction) {
    if (this.state.auction.choice) {
      return this.state.auction.choice.continue(update, this.game)
        .then(function () {
          return self.save();
        })      
    } else {
      return this.state.auction.continue(update, this.game)
        .then(function () {
          return self.save();
        });
    }
  } else {
    return this.state.continue(update, this.game)
      .then(function (whatContinueReturns) {
        if(whatContinueReturns && whatContinueReturns.length) self.game = whatContinueReturns[1];
        if(whatContinueReturns !== undefined) return self.save();
      });
  }
};

mongoose.model('Grid', schema);