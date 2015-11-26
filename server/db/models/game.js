var mongoose = require('mongoose');
var _ = require('lodash');
mongoose.Promise = require('bluebird');
var Region = mongoose.model('Region');


var playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  plants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  money: {
    type: Number,
    default: 50
  },
  color: {
    type: String,
    enum: ['purple', 'yellow', 'green', 'blue', 'red', 'black']
  },
  resources: {
    type: Object,
    default: { coal: 0, oil: 0, trash: 0, nuke: 0 }
  },
  clockwise: {
    type: Number
  },
  numCities: {
    type: Number,
    default: 0
  }
});

var schema = new mongoose.Schema({
  players: [playerSchema],
  regions: {
    type: [Number]
  },
  map: {
    type: String,
    enum: ['United States', 'Germany', 'China', 'South Korea']
  },
  plants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection'
  }]
});

schema.methods.init = function () {
  Region.makeRandom(this.map, this.players.length)
    .then(function (pickedRegions) {
      this.regions = pickedRegions;
      return Plant.find();
    })
    .then



  return this.save();
};


mongoose.model('Game', schema);