var mongoose = require('mongoose');
var Promise = require('bluebird');
var City = Promise.promisifyAll(mongoose.model('City'));

var seedCities = function () {

  var cities = [
    {
      name: 'Seattle',
      countryCode: 'us'
    },
    {
      name: 'Portland+OR',
      countryCode: 'us'
    },
    {
      name: 'Boise',
      countryCode: 'us'
    },
    {
      name: 'Billings',
      countryCode: 'us'
    },
    {
      name: 'Cheyenne',
      countryCode: 'us'
    },
    {
      name: 'Denver',
      countryCode: 'us'
    },
    {
      name: 'Omaha',
      countryCode: 'us'
    },
    {
      name: 'San Francisco',
      countryCode: 'us'
    },
    {
      name: 'Los Angeles',
      countryCode: 'us'
    },
    {
      name: 'San Diego',
      countryCode: 'us'
    },
    {
      name: 'Las Vegas',
      countryCode: 'us'
    },
    {
      name: 'Phoenix',
      countryCode: 'us'
    },
    {
      name: 'Salt Lake City',
      countryCode: 'us'
    },
    {
      name: 'Santa Fe',
      countryCode: 'us'
    },
    {
      name: 'Houston',
      countryCode: 'us'
    },
    {
      name: 'Dallas',
      countryCode: 'us'
    },
    {
      name: 'Oklahoma City',
      countryCode: 'us'
    },
    {
      name: 'Kansas City',
      countryCode: 'us'
    },
    {
      name: 'Memphis',
      countryCode: 'us'
    },
    {
      name: 'New Orleans',
      countryCode: 'us'
    },
    {
      name: 'Birmingham',
      countryCode: 'us'
    },
    {
      name: 'Atlanta',
      countryCode: 'us'
    },
    {
      name: 'Jacksonville',
      countryCode: 'us'
    },
    {
      name: 'Tampa',
      countryCode: 'us'
    },
    {
      name: 'Miami',
      countryCode: 'us'
    },
    {
      name: 'Savannah',
      countryCode: 'us'
    },
    {
      name: 'Raleigh',
      countryCode: 'us'
    },
    {
      name: 'Norfolk',
      countryCode: 'us'
    },
    {
      name: 'Fargo',
      countryCode: 'us'
    },
    {
      name: 'Duluth',
      countryCode: 'us'
    },
    {
      name: 'Minneapolis',
      countryCode: 'us'
    },
    {
      name: 'Chicago',
      countryCode: 'us'
    },
    {
      name: 'St. Louis',
      countryCode: 'us'
    },
    {
      name: 'Knoxville',
      countryCode: 'us'
    },
    {
      name: 'Cincinnati',
      countryCode: 'us'
    },
    {
      name: 'Detroit',
      countryCode: 'us'
    },
    {
      name: 'Pittsburgh',
      countryCode: 'us'
    },
    {
      name: 'Washington, D.C.',
      countryCode: 'us'
    },
    {
      name: 'Buffalo',
      countryCode: 'us'
    },
    {
      name: 'Philadelphia',
      countryCode: 'us'
    },
    {
      name: 'New York',
      countryCode: 'us'
    },
    {
      name: 'Boston',
      countryCode: 'us'
    }
  ];

  return Promise.each(cities, function (city) { return City.create(city); });

};

module.exports = seedCities;