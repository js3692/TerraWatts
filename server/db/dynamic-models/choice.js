var mongoose = require('mongoose');
var Player = mongoose.model('Player');

var schema = new mongoose.Schema({
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
		required: true
	},
	parentAuction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Auction',
		required: true
	},
	choices: {
		type: Array
	}
});

schema.methods.initialize = function() {
	return Player.findById(this.player._id || this.player)
	.then(function(foundPlayer) {	
		this.choices = this.player.plants.slice();
		this.markModified('choices');
		return this.save();
	})
}

schema.methods.continue = function(update, game) {
	if(this.player.equals(update.player)) {
		var index = update.choice.index;
		return Player.findById(this.player._id || this.player)
		.then(function (foundPlayer) {
			foundPlayer.plants.splice(index, 1);
			foundPlayer.markModified('plants');
			return foundPlayer.save();
		})
		.then(function () {
			return mongoose.model('Auction').findById(this.parentAuction)
		})
		.then(function(auction) {
			return auction.go(game)
		})
	}
}

mongoose.model('Choice', schema);