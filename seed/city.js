var mongoose = require('mongoose');
var Promise = require('bluebird');
var City = Promise.promisifyAll(mongoose.model('City'));

var seedCities = function () {

  var cities = [
    {
      name: 'Seattle',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Portland+OR',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Boise',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Billings',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Cheyenne',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Denver',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'Omaha',
      region: 1,
      countryCode: 'us'
    },
    {
      name: 'San Francisco',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Los Angeles',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'San Diego',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Las Vegas',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Phoenix',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Salt Lake City',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Santa Fe',
      region: 4,
      countryCode: 'us'
    },
    {
      name: 'Houston',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Dallas',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Oklahoma City',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Kansas City',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Memphis',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'New Orleans',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Birmingham',
      region: 5,
      countryCode: 'us'
    },
    {
      name: 'Atlanta',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Jacksonville',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Tampa',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Miami',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Savannah',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Raleigh',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Norfolk',
      region: 6,
      countryCode: 'us'
    },
    {
      name: 'Fargo',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Duluth',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Minneapolis',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Chicago',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'St. Louis',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Knoxville',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Cincinnati',
      region: 2,
      countryCode: 'us'
    },
    {
      name: 'Detroit',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Pittsburgh',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Washington, D.C.',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Buffalo',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Philadelphia',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'New York',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Boston',
      region: 3,
      countryCode: 'us'
    },
    {
      name: 'Flensburg',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Kiel',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Cuxhaven',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Wilhelmshaven',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Bremen',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Hamburg',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Hannover',
      region: 1,
      countryCode: 'ger'
    },
    {
      name: 'Lubeck',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Rostock',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Torgelow',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Schwerin',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Magdeberg',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Berlin',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Frankfurt',
      region: 2,
      countryCode: 'ger'
    },
    {
      name: 'Osnabruck',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Munster',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Duisburg',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Essen',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Dortmund',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Dusseldorf',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Kassel',
      region: 3,
      countryCode: 'ger'
    },
    {
      name: 'Halle',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Leipzig',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Dresden',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Erfurt',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Fulda',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Wurzburg',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Nurnburg',
      region: 4,
      countryCode: 'ger'
    },
    {
      name: 'Aachen',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Koln',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Trier',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Wiesbaden',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Frankfurt an der Oder',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Saarbrucken',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Mannheim',
      region: 5,
      countryCode: 'ger'
    },
    {
      name: 'Freiburg',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Stuttgart',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Konstanz',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Augsburg',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Regensberg',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Munchen',
      region: 6,
      countryCode: 'ger'
    },
    {
      name: 'Passau',
      region: 6,
      countryCode: 'ger'
    },
  ];

  return Promise.each(cities, function (city) { return City.create(city); });

};

module.exports = seedCities;