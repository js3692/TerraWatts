var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	game: {
		type: Object,
		default: null
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	complete: {
		type: Boolean,
		default: false
	},
    key: {
        type: String
    }
});

schema.methods.addUser = function (userId) {
	if (this.game) throw new Error('The Game already exists');

	if (this.users.length === 6) throw new Error('The Game is already full');

	if (this.users.indexOf(userId) > -1) throw new Error('This user is already in the room');
	
	this.users.push(userId);
	return this.save();
};

schema.methods.removeUser = function (userId) {
	var userIndex = this.users.indexOf(userId);
	console.log("before splice", this)
	this.users.splice(userIndex,1);
	console.log("after splice", this)
	return this.save();
}

schema.statics.getJoinable = function() {
	return this.find({})
		.then(function (grids) {
			return grids.filter(function (grid) {
				return !grid.game && !grid.complete;
			});
		});
};

schema.pre('save', function (next) {
	// this.users.forEach(function(user) {

	// });
	next();
});

mongoose.model('Grid', schema);