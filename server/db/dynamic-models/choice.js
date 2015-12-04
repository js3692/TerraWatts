var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
		required: true
	},
	choiceType: {
		type: String,
		enum: ['discardPlant', 'loseResources', 'powerHybrids'],
		required: true
	},
	parentState: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'State',
		required: true
	},
	choices: {
		type: Array
	}
});

schema.methods.initialize = function() {
	if (this.choiceType === 'discardPlant') {
		this.choices = this.player.plants;
	} 
	else if (this.choiceType === 'powerHybrids') {
		var totalResourcesNeeded = this.player.plants.reduce(function(prev, currPlant) {
			if(currPlant.resourceType === 'hybrid') return prev + currPlant.resourceNum;
		}, 0);
		var choices = [];
		for(var i = 0; i <= totalResourcesNeeded; i++) {
			choices.push({coal: i, oil: totalResourcesNeeded - i});
		}
		var numCoal = this.player.resources.coal, numOil = this.player.resources.oil;
		this.choices = choices.filter(function (choice) {
			return choice.coal <= numCoal && choice.oil <= numOil
		});
	} else if (this.choiceType === 'loseResources') {
		
	}
	return this.save();
}

schema.methods.continue = function(update, game) {
	if (this.choiceType === 'discardPlant') {
		var thePlant = _.find(this.player.plants, function(plant) {
			return plant.equals(update.data.plant)
		})
		this.player.plants = this.player.plants.filter(function (plant) {
			return !plant.equals(thePlant);
		})
		game.discardedPlants.push(thePlant);
	} 
	// else {
	// 	for(var resource in choice) {
	// 		player.resources[resource] -= choice[resource];
	// 	}
	// }
	return this.player.save()
	.then(function() {
		return mongoose.model('State').findById(this.parentState)
	})
	.then(function (foundState) {
		return foundState.continue(null, game);
	})
}

mongoose.model('Choice', schema);