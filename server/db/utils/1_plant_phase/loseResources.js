module.exports = function loseResources(player, game) {
	var resourceCapacity = {};
	player.plants.forEach(function (plant) {
		if(plant.resourceType === 'green') return;
		if(!resourceCapacity[plant.resourceType]) {
			resourceCapacity[plant.resourceType] = 0;
		}
		resourceCapacity[plant.resourceType] += plant.numResources*2
	});
	for(var resource in resourceCapacity) {
		if (resource !== 'hybrid') {
			var toLose = player.resources[resource] - resourceCapacity[resource];
			if (toLose > 0) {
				player.resources[resource] -= toLose;
				game.resourceBank[resource] += toLose;
			}
		}
	}
	if(resourceCapacity['hybrid']) {
		var toLose = player.resources.coal + player.resources.oil - resourceCapacity[hybrid];
		if (toLose > 0) {
			var lost = 0;
			// chooses to lose oil before coal, for now
			while(lost < toLose && player.resources.oil) {
				player.resources.oil--;
				game.resourceBank.oil++;
				lost++;
			}
			while(lost < toLose) {
				player.resources.coal--;
				game.resourceBank.coal++;
				lost++;
			}
		}
	}
}
