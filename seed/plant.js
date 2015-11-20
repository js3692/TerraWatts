var mongoose = require('mongoose');
var Promise = require('bluebird');
var Plant = Promise.promisifyAll(mongoose.model('Plant'));

var seedPlants = function() {
	var plants = [
		new Plant(3,1,'oil',2),
		new Plant(4,1,'coal',2),
		new Plant(5,1,'hybrid',2),
		new Plant(6,1,'trash',1),
		new Plant(7,2,'oil',3),
		new Plant(8,2,'coal',3),
		new Plant(9,1,'oil',1),
		new Plant(10,2,'coal',2),
		new Plant(11,2,'nuke',1),
		new Plant(12,2,'hybrid',2),
		new Plant(13,1,'green'),
		new Plant(14,2,'trash',2),
		new Plant(15,3,'coal',2),
		new Plant(16,3,'oil',2),
		new Plant(17,2,'nuke',1),
		new Plant(18,2,'green'),
		new Plant(19,3,'trash',2),
		new Plant(20,5,'coal',3),
		new Plant(21,4,'hybrid',2),
		new Plant(22,2,'green'),
		new Plant(23,3,'nuke',1),
		new Plant(24,4,'trash',2),
		new Plant(25,5,'coal',2),
		new Plant(26,5,'oil',2),
		new Plant(27,3,'green'),
		new Plant(28,4,'nuke',1),
		new Plant(29,4,'hybrid',1),
		new Plant(30,6,'trash',3),
		new Plant(31,6,'coal',3),
		new Plant(32,6,'oil',3),
		new Plant(33,4,'green'),
		new Plant(34,5,'nuke',1),
		new Plant(35,5,'oil',1),
		new Plant(36,7,'coal',3),
		new Plant(37,4,'green'),
		new Plant(38,7,'trash',3),
		new Plant(39,6,'nuke',1),
		new Plant(40,6,'oil',2),
		new Plant(42,6,'coal',2),
		new Plant(44,5,'green'),
		new Plant(46,7,'hybrid',3),
		new Plant(50,6,'green')
	];

	return Plant.createAsync(plants);
};

module.exports = seedPlants;