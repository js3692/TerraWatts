module.exports = function (player, wishlist) {
    var tracker = {
        coal: 0,
        oil: 0,
        trash: 0,
        nuke: 0,
        hybrid: 0
    };
    player.plants.forEach(function (plant) {
        if(plant.resourceType !== 'green') {
            tracker[plant.resourceType] += plant.numResources*2;
        }
    });
    for(var resource in player.resources) {
        if (!wishlist[resource]) wishlist[resource] = 0;
        tracker[resource] -= ( wishlist[resource] + player.resources[resource] );
    }
    for(var resource in tracker) {
        if (tracker[resource] < 0) {
            if (resource === 'coal' || resource === 'oil') {
                tracker.hybrid += tracker[resource];
            } else {
                return false;
            }
        }
    }
    return tracker.hybrid >= 0;
}
