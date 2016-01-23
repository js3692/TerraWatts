module.exports = function loseResources(player, game) {
	var resourceTracker = {};
	player.plants.forEach(function (plant) {
		console.log(plant);
        if(plant.resourceType === 'green') return;
		if(!resourceTracker[plant.resourceType]) {
			resourceTracker[plant.resourceType] = 0;
		}
		resourceTracker[plant.resourceType] += plant.numResources*2;
	});
    console.log('!!!!!!!!', resourceTracker)
    Object.keys(player.resources).forEach(function(resource) {
        if(!resourceTracker[resource]) resourceTracker[resource] = 0;
        resourceTracker[resource] -= player.resources[resource];
    });
    console.log('?????????', resourceTracker);
    adjust('oil', resourceTracker);
    adjust('coal', resourceTracker);
    console.log('---------', resourceTracker)
    Object.keys(resourceTracker).forEach(function(resource) {
        if(resourceTracker[resource] < 0) {
            player.resources[resource] += resourceTracker[resource];
            game.resourceBank[resource] -= resourceTracker[resource];
            game.markModified('resourceBank');
        }
    })
    console.log('###########', player.resources);
}

function adjust(resource, tracker) {
    if(resource === 'coal' || resource === 'oil') {
        while(tracker[resource] < 0 && tracker.hybrid > 0) {
            tracker[resource]++;
            tracker.hybrid--;
        }
    }
}
