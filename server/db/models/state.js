var mongoose = require('mongoose');

var steps = ['plant, resource, city, turnover'];

var schema = new mongoose.Schema({
	game: {
		type: Object,
		required: true
	},
	step: {
		type: String,
		required: true,
		enum: steps
	},
	remainingPlayers: {
		type: [Object]
	},
	activePlayer: {
		type: Object
	},
	nextStep: {
		type: String,
		enum: steps
	},
	// used in plant state
	numPasses: {
		type: Number,
		default: 0
	}
})

/* 
List of functions to adapt from game folder:

figure out data pattern for continue

determineTurnOrder
	pre save
setRemainingPlayers
	pre save
checkEndCondition
	go
setActivePlayer
	go
transaction
	continue

*/
schema.pre('save', function() {
	if(this.step === 'resource' && this.game.turn === 1) {
		this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
	}
	this.nextStep = this.steps[this.steps.indexOf(this.step) + 1] || this.steps[0];
	setRemainingPlayers()
})
schema.methods.go = function() {
	if (checkEndCondition()) return this.end();
	if (this.step !== 'turnover' || this.remainingPlayers.length === this.game.turnOrder.length) {
		setActivePlayer()
		return this;
	}
}
schema.methods.continue = function(data) {
	if(this.step !== plant) {
		transaction();
		this.playersRemaining.shift();
		return this.go();
	} else {
		// if passing: remove from players remaining, increment numPasses, return go()
		// if last person, return boughtPlant()
		// transition to auction		
	}
}

schema.methods.end = function() {
	if(this.step === 'plant') {
		// if everyone passed, discard lowest plant
		// if phase 3 was triggered, do the stuff		
	}
	if (this.step === 'turnover') {
		// check end game
		// check phase 2
		// restock resources
		// discard plant
		// determine turn order
		// transition to plant state
	}
	var nextState = new State({
		game: this.game,
		step: this.nextStep
	});
	return nextState.go();
}

mongoose.model('State', schema);
