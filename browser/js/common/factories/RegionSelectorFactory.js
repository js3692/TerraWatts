app.factory('RegionSelectorFactory', function () {

	var map = {};

	map.draw = function (selector, selectedRegions, selectedMap) {
		var svg = d3.select("#region-selector");
		var bbox = svg.node().getBoundingClientRect();
		var projection, path;

		var regionOneIds, regionTwoIds, regionThreeIds, regionFourIds, regionFiveIds;

  	if(selectedMap === "United States") {
			regionOneIds = [8, 16, 30, 31, 41, 53, 56];
			regionTwoIds = [17, 18, 19, 21, 27, 38, 39, 46, 47, 55];
			regionThreeIds = [9, 10, 11, 23, 24, 25, 26, 33, 34, 36, 42, 43, 44, 50];
			regionFourIds = [4, 6, 32, 35, 49];
			regionFiveIds = [1, 5, 20, 22, 28, 29, 40, 48];

	  	projection = d3.geo.albers()
	  		.scale(bbox.width)
	  		.translate([bbox.width / 2, bbox.height / 2]);

	  	path = d3.geo.path().projection(projection);

			d3.json("/utils/maps/us.json", function(error, us) {
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

				var convert = {
					1: { name: 'one', selected: false },
					2: { name: 'two', selected: false },
					3: { name: 'three', selected: false },
					4: { name: 'four', selected: false },
					5: { name: 'five', selected: false },
					6: { name: 'six', selected: false }
				};

				if(selectedRegions) {
					selectedRegions.forEach(function (regionId) {
						convert[regionId].selected = true;
					});
				}

				regions.forEach(function (elem, index) {
					us.objects.states.geometries = elem;
					svg.append("g").append("path")
		      	.datum(topojson.feature(us, us.objects.states))
		      	.attr("d", path)
		      	.classed("region-" + convert[index + 1].name, true)
		      	.classed("region-selected", convert[index + 1].selected)
		      	.on("click", function () {
		      		selector(index);
		      	});
				});
			});
  	} else if (selectedMap === "Germany") {
  		regionOneIds = [6321, 942, 1518, 1520];
			regionTwoIds = [2334, 2335, 3562, 3312];
			regionThreeIds = [1515, 1517];
			regionFourIds = [1519, 2336];
			regionFiveIds = [2331, 2332];

  		projection = d3.geo.mercator()
	  		.scale(bbox.width * 2.2)
      	.center([10.437274617500082,51.333495750273435])
	  		.translate([bbox.width / 2, bbox.height / 2]);

  		path = d3.geo.path().projection(projection);

			d3.json("/utils/maps/germany.json",function(error, germany) {
				if (error) return console.log(error);

				console.log(germany)

				// "states" contain the rest of the states, i.e. continental states
				var states = germany.objects.states.geometries.slice();

				var regionOne = _.remove(states, function (state) { return regionOneIds.some(id => id === state.id); });
				var regionTwo = _.remove(states, function (state) { return regionTwoIds.some(id => id === state.id); });
				var regionThree = _.remove(states, function (state) { return regionThreeIds.some(id => id === state.id); });
				var regionFour = _.remove(states, function (state) { return regionFourIds.some(id => id === state.id); });
				var regionFive = _.remove(states, function (state) { return regionFiveIds.some(id => id === state.id); });
				var regionSix = states;

				var regions = [regionOne, regionTwo, regionThree, regionFour, regionFive, regionSix];

				var convert = {
					1: { name: 'one', selected: false },
					2: { name: 'two', selected: false },
					3: { name: 'three', selected: false },
					4: { name: 'four', selected: false },
					5: { name: 'five', selected: false },
					6: { name: 'six', selected: false }
				};

				if(selectedRegions) {
					selectedRegions.forEach(function (regionId) {
						convert[regionId].selected = true;
					});
				}

				regions.forEach(function (elem, index) {
					germany.objects.states.geometries = elem;
					svg.append("g").append("path")
		      	// .datum(topojson.feature(us, us.objects.states))
				  	.data(topojson.feature(germany, germany.objects.states).features)
		      	// .enter().append("path")
		      	.attr("d", path)
		      	.classed("region-" + convert[index + 1].name, true)
		      	.classed("region-selected", convert[index + 1].selected)
		      	.on("click", function () {
		      		selector(index);
		      	});
				});

						//Group for the map features
			// var features = svg.append("g")
			// 	.attr("class", "features");

				// features.selectAll("path")
			 //  	.data(topojson.feature(germany, germany.objects.states).features)
			 //  	.enter()
			 //  	.append("path")
			 //  	.attr("d", path)
			  	// .on("click",function () {
			  	// 	selector(index)
			  	// });

			});

  	}

	}

	return map;

});