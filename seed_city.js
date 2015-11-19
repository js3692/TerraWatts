var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var City = Promise.promisifyAll(mongoose.model('City'));
var Connection = Promise.promisifyAll(mongoose.model('Connection'));

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

var seedConnections = function () {
  var connections = [
    { cityNames: ['New York', 'Boston'] },
    { cityNames: ['New York', 'Philadelphia'] },
    { cityNames: ['New York', 'Buffalo'] },
    { cityNames: ['Pittsburgh', 'Buffalo'] },
    { cityNames: ['Washington, D.C.', 'Philadelphia'] },
    { cityNames: ['Pittsburgh', 'Washington, D.C.'] },
    { cityNames: ['Norfolk', 'Washington, D.C.'] },
    { cityNames: ['Raleigh', 'Norfolk'] },
    { cityNames: ['Raleigh', 'Pittsburgh'] },
    { cityNames: ['Detroit', 'Buffalo'] },
    { cityNames: ['Detroit', 'Pittsburgh'] },
    { cityNames: ['Detroit', 'Duluth'] },
    { cityNames: ['Detroit', 'Chicago'] },
    { cityNames: ['Detroit', 'Cincinnati'] },
    { cityNames: ['Pittsburgh', 'Cincinnati'] },
    { cityNames: ['Cincinnati', 'Raleigh'] },
    { cityNames: ['Cincinnati', 'Knoxville'] },
    { cityNames: ['Cincinnati', 'Chicago'] },
    { cityNames: ['Cincinnati', 'St. Louis'] },
    { cityNames: ['Knoxville', 'Atlanta'] },
    { cityNames: ['Atlanta', 'Raleigh'] },
    { cityNames: ['Raleigh', 'Savannah'] },
    { cityNames: ['Atlanta', 'Savannah'] },
    { cityNames: ['Savannah', 'Jacksonville'] },
    { cityNames: ['Jacksonville', 'Tampa'] },
    { cityNames: ['Tampa', 'Miami'] },
    { cityNames: ['Atlanta', 'Birmingham'] },
    { cityNames: ['Atlanta', 'St. Louis'] },
    { cityNames: ['Jacksonville', 'Birmingham'] },
    { cityNames: ['Jacksonville', 'New Orleans'] },
    { cityNames: ['Birmingham', 'New Orleans'] },
    { cityNames: ['Birmingham', 'Memphis'] },
    { cityNames: ['New Orleans', 'Memphis'] },
    { cityNames: ['New Orleans', 'Houston'] },
    { cityNames: ['New Orleans', 'Dallas'] },
    { cityNames: ['Memphis', 'Dallas'] },
    { cityNames: ['Memphis', 'Oklahoma City'] },
    { cityNames: ['Memphis', 'Kansas City'] },
    { cityNames: ['Memphis', 'St. Louis'] },
    { cityNames: ['Chicago', 'St. Louis'] },
    { cityNames: ['St. Louis', 'Kansas City'] },
    { cityNames: ['Chicago', 'Kansas City'] },
    { cityNames: ['Chicago', 'Omaha'] },
    { cityNames: ['Chicago', 'Minneapolis'] },
    { cityNames: ['Chicago', 'Duluth'] },
    { cityNames: ['Duluth', 'Minneapolis'] },
    { cityNames: ['Duluth', 'Fargo'] },
    { cityNames: ['Fargo', 'Minneapolis'] },
    { cityNames: ['Omaha', 'Minneapolis'] },
    { cityNames: ['Omaha', 'Kansas City'] },
    { cityNames: ['Kansas City', 'Oklahoma City'] },
    { cityNames: ['Oklahoma City', 'Dallas'] },
    { cityNames: ['Dallas', 'Houston'] },
    { cityNames: ['Fargo', 'Billings'] },
    { cityNames: ['Billings', 'Minneapolis'] },
    { cityNames: ['Minneapolis', 'Cheyenne'] },
    { cityNames: ['Omaha', 'Cheyenne'] },
    { cityNames: ['Denver', 'Kansas City'] },
    { cityNames: ['Santa Fe', 'Kansas City'] },
    { cityNames: ['Oklahoma City', 'Santa Fe'] },
    { cityNames: ['Dallas', 'Santa Fe'] },
    { cityNames: ['Houston', 'Santa Fe'] },
    { cityNames: ['Denver', 'Santa Fe'] },
    { cityNames: ['Cheyenne', 'Denver'] },
    { cityNames: ['Billings', 'Cheyenne'] },
    { cityNames: ['Salt Lake City', 'Santa Fe'] },
    { cityNames: ['Salt Lake City', 'Denver'] },
    { cityNames: ['Salt Lake City', 'Boise'] },
    { cityNames: ['Salt Lake City', 'San Francisco'] },
    { cityNames: ['Salt Lake City', 'Las Vegas'] },
    { cityNames: ['Santa Fe', 'Phoenix'] },
    { cityNames: ['Santa Fe', 'Las Vegas'] },
    { cityNames: ['Las Vegas', 'Phoenix'] },
    { cityNames: ['Cheyenne', 'Boise'] },
    { cityNames: ['Billings', 'Boise'] },
    { cityNames: ['Seattle', 'Billings'] },
    { cityNames: ['Seattle', 'Boise'] },
    { cityNames: ['Boise', 'Portland'] },
    { cityNames: ['Seattle', 'Portland'] },
    { cityNames: ['Boise', 'San Francisco'] },
    { cityNames: ['Portland', 'San Francisco'] },
    { cityNames: ['Las Vegas', 'San Francisco'] },
    { cityNames: ['Las Vegas', 'Los Angeles'] },
    { cityNames: ['San Francisco', 'Los Angeles'] },
    { cityNames: ['Los Angeles', 'San Diego'] },
    { cityNames: ['Phoenix', 'San Diego'] },
    { cityNames: ['Las Vegas', 'San Diego'] }
  ];

  return Promise.each(connections, function (connection) { return Connection. create(connection); });
};

connectToDb.then(function (db) {
    return db.db.dropDatabase();
})
.then(function () {
  console.log(chalk.magenta('Database dropped'));
  return seedCities();
})
.then (function () {
  return seedConnections();
})
.then(function () {
  console.log(chalk.green('Seed successful!'));
  process.kill(0);
}).catch(function (err) {
  console.error(err);
  process.kill(1);
});