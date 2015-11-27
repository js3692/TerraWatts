var mongoose = require('mongoose');
var _ = require('lodash');
mongoose.Promise = require('bluebird');
var Region = mongoose.model('Region');
var Plant = mongoose.model('Plant');
var City = mongoose.model('City');
var Connection = mongoose.model('Connection');

var restockRatesMaster = require('./restock.js');
var shuffle = require('./shuffle.js');


var playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  }],
  turnOrder: {
    type: [Number]
  },
  turn: {
    type: Number,
    default: 1
  },
  phase: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  resourceMarket: {
    type: Object,
    default: { coal: 24, oil: 15, trash: 6, nuke: 2 }
  },
  resouceBank: {
    type: Object,
    default: { coal: 0, oil: 9, trash: 18, nuke: 10 }
  },
  restockRates: {
    type: Object
  },
  plantMarket: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  plantDeck: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  discardedPlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }],
  phaseThreePlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  }]
});

schema.methods.init = function (players, map) {
  function grabObjectId (documents) {
    return documents.map(function (doc) {
      return doc._id;
    });
  }

  function removePlants(shuffledPlants, numPlayers) {
    if(numPlayers < 5) {
      shuffledPlants.splice(0,4);
    }
    if(numPlayers < 4) {
      shuffledPlants.splice(0,4);
    }
    return shuffledPlants;
  }

  // players should have User._id, color, and clockwise order
  this.players.create(players)
    .then(function () {
      this.map = map;
      this.turnOrder = shuffle(this.players);
      this.restockRates = restockRatesMaster[this.players.length][this.phase]
      return Region.makeRandom(this.map, this.players.length);
    })
    .then(function (pickedRegions) {
      this.regions = pickedRegions;
      return Plant.find().sort({ rank: 'asc' });
    })
    .then(function (plants) {
      var allPlants = grabObjectId(plants);
      this.plantMarket = allPlants.splice(0, 8);

      var thirteen = allPlants.splice(2, 1);

      var remainingPlants = removePlants(shuffle(allPlants), this.players.length);

      this.plantDeck = thirteen.concat(remainingPlants);
      // The following will depend on this.map
      // but stick with 'us' for now
      return City.find({ countryCode: 'us' });
    })
    .then(function (cities) {
      this.cities = grabObjectId(cities);
      // The following will depend on this.map
      return Connection.find();
    })
    .then(function (connections) {
      this.connections = grabObjectId(connections);

    })



  return this.save();
};


mongoose.model('Game', schema);