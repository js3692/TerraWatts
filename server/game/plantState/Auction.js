var State = require('../state');
var _ = require('lodash');

function Auction(plant, openingBid, plantState) {
	this.plant = plant;
	this.validations = validations;
	this.bid = openingBid;
	this.plantState = this.game.currentState;
	this.highestBidder = this.plantState.canChoosePlant[0];
	this.playersInAuction = initPIA(this.canChoosePlant, this.highestBidder);
	State.call(this);
}

Auction.prototype = Object.create(State.prototype);
Auction.prototype.constructor = State;

Auction.prototype.go = function () {
	if (this.playersInAuction.length === 1) {
		this.plantState.boughtPlant(this.highestBidder.color, this.plant, this.bid);
	} else {
		this.playersInAuction.forEach(function (player, i) {
			if (player.color = highestBidder.color) {
				this.plantState.game.activePlayer = this.playersInAuction[(i+1)%this.playersInAuction.length]
			}
		})
		// sends out for bid
	}
}

// a bid of 0 will connotate a pass
Auction.prototype.continue = function(bid, playerColor) {
	if (bid === 0 || bid === 'pass') {
		this.playersInAuction = this.playersInAuction.filter(function (player) {
			return player.color !== playerColor;
		})
	} else {
		this.highestBidder = _.find(this.playersInAuction, function (player) {
			return player.color === playerColor;
		})
		this.bid = bid;
	}
	this.go();
}

function initPIA (players, startingPlayer) {
	players.forEach(function (player) {
		player.clockwise = (player.clockwise - startingPlayer.clockwise + players.length) % players.length;
	})
	return players.sort(function (player1, player2) {
		return player1.clockwise < player2.clockwise ? -1 : 1;
	})
}

module.exports = Auction;