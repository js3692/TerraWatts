module.exports = {

	USRegionColors: ['purple', 'yellow', 'brown', 'blue', 'red', 'green'],
	regionConnectedness: {US: [[1,3,4],[0,2,4,5],[1,5],[0,4],[0,1,3,5],[1,2,4]]},
	numRegionsByPlayers: {2: 3, 3: 3, 4: 4, 5: 5, 6: 5},
	randomize: function(numPlayers, map) {
		map  = map || 'US';
		var connectedness = this.regionConnectedness[map];
		var numRegions = this.numRegionsByPlayers[numPlayers];
		//start with a random region, 1-5
		var using = [Math.floor(Math.random()*6)];
		while (using.length < numRegions) {
			var connected = using.reduce(function(prev, curr) {
				return prev.concat(connectedness[curr])
			}, []);
			var filtered = connected.filter(function(region,i) {
	    		return (connected.indexOf(region) === i && using.indexOf(region) === -1)
			});
			using.push(filtered[Math.floor(Math.random()*filtered.length)]);
		}
		return using;
	}
}