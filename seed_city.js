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
    { cityNames: ['New York', 'Boston'], distance: 3 },
    { cityNames: ['New York', 'Philadelphia'], distance: 0},
    { cityNames: ['New York', 'Buffalo'], distance: 8 },
    { cityNames: ['Pittsburgh', 'Buffalo'], distance: 7 },
    { cityNames: ['Washington, D.C.', 'Philadelphia'], distance: 3 },
    { cityNames: ['Pittsburgh', 'Washington, D.C.'], distance: 6 },
    { cityNames: ['Norfolk', 'Washington, D.C.'], distance: 5 },
    { cityNames: ['Raleigh', 'Norfolk'], distance: 3 },
    { cityNames: ['Raleigh', 'Pittsburgh'], distance: 7 },
    { cityNames: ['Detroit', 'Buffalo'], distance: 7 },
    { cityNames: ['Detroit', 'Pittsburgh'], distance: 6 },
    { cityNames: ['Detroit', 'Duluth'], distance: 15 },
    { cityNames: ['Detroit', 'Chicago'], distance:7 },
    { cityNames: ['Detroit', 'Cincinnati'], distance:4 },
    { cityNames: ['Pittsburgh', 'Cincinnati'], distance: 7 },
    { cityNames: ['Cincinnati', 'Raleigh'], distance: 15 },
    { cityNames: ['Cincinnati', 'Knoxville'], distance: 6 },
    { cityNames: ['Cincinnati', 'Chicago'], distance: 7 },
    { cityNames: ['Cincinnati', 'St. Louis'], distance:12 },
    { cityNames: ['Knoxville', 'Atlanta'], distance: 5 },
    { cityNames: ['Atlanta', 'Raleigh'], distance: 7 },
    { cityNames: ['Raleigh', 'Savannah'], distance:7 },
    { cityNames: ['Atlanta', 'Savannah'], distance: 7 },
    { cityNames: ['Savannah', 'Jacksonville'], distance:0 },
    { cityNames: ['Jacksonville', 'Tampa'], distance: 4 },
    { cityNames: ['Tampa', 'Miami'], distance: 4 },
    { cityNames: ['Atlanta', 'Birmingham'], distance:3 },
    { cityNames: ['Atlanta', 'St. Louis'], distance:12 },
    { cityNames: ['Jacksonville', 'Birmingham'], distance:9 },
    { cityNames: ['Jacksonville', 'New Orleans'], distance:16 },
    { cityNames: ['Birmingham', 'New Orleans'], distance:11 },
    { cityNames: ['Birmingham', 'Memphis'], distance: 6},
    { cityNames: ['New Orleans', 'Memphis'], distance: 7 },
    { cityNames: ['New Orleans', 'Houston'], distance:8 },
    { cityNames: ['New Orleans', 'Dallas'], distance: 12 },
    { cityNames: ['Memphis', 'Dallas'], distance:12 },
    { cityNames: ['Memphis', 'Oklahoma City'], distance:14 },
    { cityNames: ['Memphis', 'Kansas City'], distance:12 },
    { cityNames: ['Memphis', 'St. Louis'], distance:7 },
    { cityNames: ['Chicago', 'St. Louis'], distance:10 },
    { cityNames: ['St. Louis', 'Kansas City'], distance:6 },
    { cityNames: ['Chicago', 'Kansas City'], distance:8 },
    { cityNames: ['Chicago', 'Omaha'], distance:13 },
    { cityNames: ['Chicago', 'Minneapolis'], distance:8 },
    { cityNames: ['Chicago', 'Duluth'], distance:12 },
    { cityNames: ['Duluth', 'Minneapolis'], distance:5 },
    { cityNames: ['Duluth', 'Fargo'], distance:6 },
    { cityNames: ['Fargo', 'Minneapolis'], distance:6 },
    { cityNames: ['Omaha', 'Minneapolis'], distance:8 },
    { cityNames: ['Omaha', 'Kansas City'], distance:5 },
    { cityNames: ['Kansas City', 'Oklahoma City'], distance:8 },
    { cityNames: ['Oklahoma City', 'Dallas'], distance:3 },
    { cityNames: ['Dallas', 'Houston'], distance:5 },
    { cityNames: ['Fargo', 'Billings'], distance:17 },
    { cityNames: ['Billings', 'Minneapolis'], distance:18 },
    { cityNames: ['Minneapolis', 'Cheyenne'], distance:18 },
    { cityNames: ['Omaha', 'Cheyenne'], distance:14 },
    { cityNames: ['Denver', 'Kansas City'], distance:16 },
    { cityNames: ['Santa Fe', 'Kansas City'], distance:16 },
    { cityNames: ['Oklahoma City', 'Santa Fe'], distance:15 },
    { cityNames: ['Dallas', 'Santa Fe'], distance:16 },
    { cityNames: ['Houston', 'Santa Fe'], distance:21 },
    { cityNames: ['Denver', 'Santa Fe'], distance: 13 },
    { cityNames: ['Cheyenne', 'Denver'], distance:0 },
    { cityNames: ['Billings', 'Cheyenne'], distance:9 },
    { cityNames: ['Salt Lake City', 'Santa Fe'], distance:28 },
    { cityNames: ['Salt Lake City', 'Denver'], distance:21 },
    { cityNames: ['Salt Lake City', 'Boise'], distance:8 },
    { cityNames: ['Salt Lake City', 'San Francisco'], distance:27 },
    { cityNames: ['Salt Lake City', 'Las Vegas'], distance:18 },
    { cityNames: ['Santa Fe', 'Phoenix'], distance:18 },
    { cityNames: ['Santa Fe', 'Las Vegas'], distance: 27},
    { cityNames: ['Las Vegas', 'Phoenix'], distance: 15 },
    { cityNames: ['Cheyenne', 'Boise'], distance:24 },
    { cityNames: ['Billings', 'Boise'], distance:12 },
    { cityNames: ['Seattle', 'Billings'], distance:9 },
    { cityNames: ['Seattle', 'Boise'], distance:12 },
    { cityNames: ['Boise', 'Portland'] , distance:13},
    { cityNames: ['Seattle', 'Portland'], distance:3 },
    { cityNames: ['Boise', 'San Francisco'], distance:23 },
    { cityNames: ['Portland', 'San Francisco'], distance:24 },
    { cityNames: ['Las Vegas', 'San Francisco'], distance: 14},
    { cityNames: ['Las Vegas', 'Los Angeles'], distance:9 },
    { cityNames: ['San Francisco', 'Los Angeles'], distance:9 },
    { cityNames: ['Los Angeles', 'San Diego'], distance:3 },
    { cityNames: ['Phoenix', 'San Diego'], distance:14 },
    { cityNames: ['Las Vegas', 'San Diego'], distance:9 }
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