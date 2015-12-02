var mongoose = require('mongoose');
var _ = require('lodash');
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

schema.methods.initialize = function() {
	console.log('initing auction');
    var self = this;
    this.remainingPlayers = this.plantState.remainingPlayers;
	var numPlayers = this.remainingPlayers.length;
	this.remainingPlayers.forEach(function (player) {
		player.clockwise = (player.clockwise - self.highestBidder.clockwise + numPlayers) % numPlayers;
	})
	this.remainingPlayers = this.remainingPlayers.sort(function (player1, player2) {
		return player1.clockwise < player2.clockwise ? -1 : 1;
	})
	return this.go();
}

schema.methods.go = function() {
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
                return foundState.transaction(result);
            })
        
	} else {
            console.log(self,'self')
		this.remainingPlayers.forEach(function (player, i) {
			if (player.equals(self.highestBidder)) {
				self.activePlayer = self.remainingPlayers[(i+1)%self.remainingPlayers.length]
			}
		})
		return this.save();	
	}
}
// update has player and bid
schema.methods.continue = function(update) {
	console.log('auctions continue has been called')
    var player = update.player;
    console.log('found player', player);
	if (update.data === 'pass' || update.data.bid <= this.bid) {
		this.remainingPlayers = this.remainingPlayers.filter(function (playerId) {
			return !playerId.equals(player._id);
		})
	} else {
		this.highestBidder = player._id;
		this.bid = update.data.bid;
	}
	return this.go();
}

mongoose.model('Auction', schema);