'use strict';
var request = require('request');
var mongoose = require('mongoose');
var chalk = require('chalk');
var City = mongoose.model('City');

var schema = new mongoose.Schema({
  cityNames: {
    type: [String],
    required: true
  },
  distance: {
    type: Number
  },
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }]
});

schema.pre('save', function (next) {
  var self = this;
  City.find({ name: { $in: this.cityNames } })
    .then(function (foundCities) {
      self.cities = foundCities.map(function (elem) { return elem._id; });
//      request('https://maps.googleapis.com/maps/api/distancematrix/json?' + 'origins=' + foundCities[0].location[0] + ',' + foundCities[0].location[1] + '&destinations=' + foundCities[1].location[0] + ',' + foundCities[1].location[1] + '&key=AIzaSyDY1FnH6Ji9xdyIBTPnApj07nvn-yHyf5o', function (err, res, body) {
//        if (!err && res.statusCode == 200) {
//          self.distance = normalize(JSON.parse(body).rows[0].elements[0].distance.value);
//          console.log(chalk.blue(self.cityNames[0], '-', self.cityNames[1] + ":", self.distance));
//          next();
//        } else next(err);
//      });
      next();
    })
    .then(null, next);
});

function normalize (realDistance) {
  return Math.floor(realDistance / 100000) + Math.floor(Math.random() * 5);
}

mongoose.model('Connection', schema);