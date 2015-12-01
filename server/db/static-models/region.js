'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var numRegions = require('../utils/0_basic_rules/dependsOnNumPlayers.js').numRegions;

var schema = new mongoose.Schema({
  regionId: {
    type: Number,
    required: true
  },
  color: {
    type: String
  },
  map: {
    type: String,
    enum: ['United States', 'Germany', 'China', 'South Korea'],
    required: true
  },
  adjacent: {
    type: [Number],
    required: true
  }
});

schema.statics.makeRandom = function (map, numPlayers) {
  function randomElem(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  return this.find({map: map})
  .then(function (regions) {
    var starter = randomElem(regions);
    var using = [starter];
    var usingIdxs = [starter.regionId];
    var connected = starter.adjacent.slice();
    while(using.length < numRegions[numPlayers]) {
      var idxToAdd = randomElem(connected);
      var theRegion = _.find(regions, function (region) {
        return region.regionId === idxToAdd;
      });
      using.push(theRegion);
      usingIdxs.push(idxToAdd);
      connected.splice(connected.indexOf(idxToAdd), 1);
 
      theRegion.adjacent.forEach(function (regionId) {
        if (connected.indexOf(regionId) < 0 && usingIdxs.indexOf(regionId) < 0) {
          connected.push(regionId);
        }
      })
    }
    return using;
  })
}

mongoose.model('Region', schema);