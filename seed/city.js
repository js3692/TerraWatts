var mongoose = require('mongoose');
var Promise = require('bluebird');
var City = Promise.promisifyAll(mongoose.model('City'));

var seedCities = function () {

  var cities = [
    {
      name: 'Seattle',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Portland+OR',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Boise',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Billings',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Cheyenne',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Denver',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'Omaha',
      region: 0,
      countryCode: 'us'
    },
    {
      name: 'San Francisco',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Los Angeles',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'San Diego',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Las Vegas',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Phoenix',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Salt Lake City',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Santa Fe',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Houston',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Dallas',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Oklahoma City',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Kansas City',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Memphis',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'New Orleans',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Birmingham',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Atlanta',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Jacksonville',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Tampa',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Miami',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Savannah',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Raleigh',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Norfolk',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Fargo',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Duluth',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Minneapolis',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Chicago',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'St. Louis',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Knoxville',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Cincinnati',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Detroit',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Pittsburgh',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Washington, D.C.',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Buffalo',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Philadelphia',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'New York',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Boston',
      region: 2,
      countryCode: 'us'
    }
  ];

  return Promise.each(cities, function (city) { return City.create(city); });

};

module.exports = seedCities;