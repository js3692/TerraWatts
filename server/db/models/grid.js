var mongoose = require('mongoose');
var firebaseHelper = require('../../firebase');
var _ = require('lodash');
mongoose.Promise = require('bluebird');

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

schema.methods.addUser = function (user) {
    
    if (this.game) throw new Error('The Game already exists');

    if (this.users.length === 6) throw new Error('The Game is already full');

    if (this.users.indexOf(user._id) > -1) return Promise.resolve(this.game);

	
	this.users.push(user);
	return this.save();
};

schema.statics.getJoinable = function() {
	return this.find({})
		.then(function (grids) {
			return grids.filter(function (grid) {
				return !grid.game && !grid.complete;
			});
		});
};

schema.pre('save', function (next) {
    
    /* 
        finds connection within connections hash
        then updates firebase game object.
    */
    
    var firebasePath = firebaseHelper.getConnection(this.key);
    if(firebasePath) firebasePath.set(this.toObject());
    
	next();
});

mongoose.model('Grid', schema);