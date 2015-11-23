var mongoose = require('mongoose');
var Promise = require('bluebird');
var Plant = Promise.promisifyAll(mongoose.model('Plant'));

function plantHelperConstructor (rank, capacity, resourceType, numResources) {
	this.rank = rank;
	this.capacity = capacity;
	this.resourceType = resourceType;
	this.numResources = numResources || 0;
}

var seedPlants = function() {
	var plants = [
		new plantHelperConstructor(3,1,'oil',2),
		new plantHelperConstructor(4,1,'coal',2),
		new plantHelperConstructor(5,1,'hybrid',2),
		new plantHelperConstructor(6,1,'trash',1),
		new plantHelperConstructor(7,2,'oil',3),
		new plantHelperConstructor(8,2,'coal',3),
		new plantHelperConstructor(9,1,'oil',1),
		new plantHelperConstructor(10,2,'coal',2),
		new plantHelperConstructor(11,2,'nuke',1),
		new plantHelperConstructor(12,2,'hybrid',2),
		new plantHelperConstructor(13,1,'green'),
		new plantHelperConstructor(14,2,'trash',2),
		new plantHelperConstructor(15,3,'coal',2),
		new plantHelperConstructor(16,3,'oil',2),
		new plantHelperConstructor(17,2,'nuke',1),
		new plantHelperConstructor(18,2,'green'),
		new plantHelperConstructor(19,3,'trash',2),
		new plantHelperConstructor(20,5,'coal',3),
		new plantHelperConstructor(21,4,'hybrid',2),
		new plantHelperConstructor(22,2,'green'),
		new plantHelperConstructor(23,3,'nuke',1),
		new plantHelperConstructor(24,4,'trash',2),
		new plantHelperConstructor(25,5,'coal',2),
		new plantHelperConstructor(26,5,'oil',2),
		new plantHelperConstructor(27,3,'green'),
		new plantHelperConstructor(28,4,'nuke',1),
		new plantHelperConstructor(29,4,'hybrid',1),
		new plantHelperConstructor(30,6,'trash',3),
		new plantHelperConstructor(31,6,'coal',3),
		new plantHelperConstructor(32,6,'oil',3),
		new plantHelperConstructor(33,4,'green'),
		new plantHelperConstructor(34,5,'nuke',1),
		new plantHelperConstructor(35,5,'oil',1),
		new plantHelperConstructor(36,7,'coal',3),
		new plantHelperConstructor(37,4,'green'),
		new plantHelperConstructor(38,7,'trash',3),
		new plantHelperConstructor(39,6,'nuke',1),
		new plantHelperConstructor(40,6,'oil',2),
		new plantHelperConstructor(42,6,'coal',2),
		new plantHelperConstructor(44,5,'green'),
		new plantHelperConstructor(46,7,'hybrid',3),
		new plantHelperConstructor(50,6,'green')
	];

	return Plant.createAsync(plants);
};

module.exports = seedPlants;