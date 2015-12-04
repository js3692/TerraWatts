module.exports = function spendHybridResources(hybridResourcesNeeded, player, update, game) {
	var hybridOptions = [];
	
	for(var i = 0; i <= hybridResourcesNeeded; i++) {
		hybridOptions.push({coal: i, oil: hybridResourcesNeeded - i});
	}
	
	hybridOptions = hybridOptions.filter(function (option) {
		var hasCoal = player.resources.coal >= option.coal;
		var hasOil = player.resources.oil >= option.oil;
		return hasCoal && hasOil;
	})
	
	var resourcesToUse = (hybridOptions.length === 1)? hybridOptions[0] : update.choice.resourcesToUseForHybrids;
	
	Object.keys(resourcesToUse).forEach(function (resource) {
		player.resources[resource] -= resourcesToUse[resource];
		game.resourceBank[resource] += resourcesToUse[resource];
	})
}