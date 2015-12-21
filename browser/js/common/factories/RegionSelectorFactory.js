app.factory('RegionSelectorFactory', function ($q) {

	var uStates = {};
	var regionOneIds = [8, 16, 30, 31, 41, 53, 56];
	var regionTwoIds = [17, 18, 19, 21, 27, 38, 39, 46, 47, 55];
	var regionThreeIds = [9, 10, 11, 23, 24, 25, 26, 33, 34, 36, 42, 43, 44, 50];
	var regionFourIds = [4, 6, 32, 35, 49];
	var regionFiveIds = [1, 5, 20, 22, 28, 29, 40, 48];

	uStates.draw = function (selector) {

  	var svg = window.d3.select("#region-selector");
		var bbox = svg.node().getBoundingClientRect();
  	var projection = window.d3.geo.albersUsa()
      	.scale(bbox.width)
      	.translate([bbox.width / 2, bbox.height / 2]);
  	var path = window.d3.geo.path().projection(projection);

		window.d3.json("/utils/maps/us-topo.json", function(error, us) {
			if (error) return console.error(error);

			// Remove Alaska, Hawaii, etc.
			_.remove(us.objects.states.geometries, state => state.id === 2 || state.id === 15 || state.id > 56);
			
			// "states" contain the rest of the states, i.e. continental states
			var states = us.objects.states.geometries.slice();

			// Each region has an array of geometries
			var regionOne = _.remove(states, function (state) { return regionOneIds.some(id => id === state.id); });
			var regionTwo = _.remove(states, function (state) { return regionTwoIds.some(id => id === state.id); });
			var regionThree = _.remove(states, function (state) { return regionThreeIds.some(id => id === state.id); });
			var regionFour = _.remove(states, function (state) { return regionFourIds.some(id => id === state.id); });
			var regionFive = _.remove(states, function (state) { return regionFiveIds.some(id => id === state.id); });
			var regionSix = states;

			var regions = [regionOne, regionTwo, regionThree, regionFour, regionFive, regionSix];

			var convert = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' };

			regions.forEach(function (elem, index) {
				us.objects.states.geometries = elem;
				svg.append("g").append("path")
	      	.datum(window.topojson.feature(us, us.objects.states))
	      	.attr("d", path)
	      	.classed("region-" + convert[index + 1], true)
	      	.on("click", function () {
	      		// var self = window.d3.select(this);
	      		// self.classed("region-selected", !self.classed("region-selected"));
	      		selector(index);
	      	});
			});

		});
	}

	return uStates;

});