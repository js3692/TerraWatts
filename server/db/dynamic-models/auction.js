var mongoose = require('mongoose');
// var _ = require('lodash');
//var State = mongoose.model('State');

var schema = new mongoose.Schema({
	plant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Plant',
		required: true
	},
	bid: {
		type: Number,
		required: true
	},
	plantState: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'State',
		required: true
	},
	highestBidder: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	},
	remainingPlayers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	}],
	activePlayer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	}
})

schema.methods.initialize = function(game) {
  var self = this;
  this.remainingPlayers = this.plantState.remainingPlayers;
	var numPlayers = this.remainingPlayers.length;

	this.remainingPlayers.forEach(function (player) {
		player.clockwise = (player.clockwise - self.highestBidder.clockwise + numPlayers) % numPlayers;
	});

	this.remainingPlayers = this.remainingPlayers.sort(function (player1, player2) {
		return player1.clockwise < player2.clockwise ? -1 : 1;
	})

	return this.go(game);
}

schema.methods.go = function (game) {
  var self = this;

	if (this.remainingPlayers.length === 1) {

		var result = {
			player: this.highestBidder,
			data: {
				plant: this.plant,
				bid: this.bid
			}
		};
    return mongoose.model('State').findById(this.plantState)
      .then(function (foundState) {
        return foundState.transaction(result, game);
      });
	} else {
		this.remainingPlayers.forEach(function (player, i) {
			if (player.equals(self.highestBidder)) {
				self.activePlayer = self.remainingPlayers[(i + 1) % self.remainingPlayers.length];
			}
		});
		return this.save();	
	}
}

// update has player and bid
schema.methods.continue = function(update, game) {
  var player = update.player;

	if (update.data === 'pass' || update.data.bid <= this.bid) {
		this.remainingPlayers = this.remainingPlayers.filter(function (playerId) {
			return !playerId.equals(player._id);
		});
	} else {
		this.highestBidder = player._id;
		this.bid = update.data.bid;
	}

	return this.go(game);
}

mongoose.model('Auction', schema);