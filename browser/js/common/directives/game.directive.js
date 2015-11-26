app.directive('game', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="gameMap"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

		 	scope.$watch('data', function(newData, oldData) {
		 		var gridGame = newData;
	 			var cities = gridGame.cities;

		 		if(cities) {

				    var svgWidth = 1440,
						svgHeight = 900,
						buffer = 40;

			    	var xBank = [],
			    		yBank = []
			    	cities.forEach(function(city) {
			    		var lat = city.location[0];
			    		var lon = city.location[1];
			    		xBank.push(lon);
			    		yBank.push(lat);
			    	})
			    	var xMin = Math.min.apply(null, xBank),
			    		xMax = Math.max.apply(null, xBank),
			    		xRange = xMax-xMin,
			    		yMin = Math.min.apply(null, yBank),
			    		yMax = Math.max.apply(null, yBank),
			    		yRange = yMax-yMin;

					var svg = d3.select('#gameMap')
						.append('svg')
						.attr('id', 'map')
						.attr('width', svgWidth) 
						.attr('height', svgHeight);

					var width = 960,
						height = 200;

					d3.json("/utils/maps/us-topo.json", function(error, us) {
						if(error) return console.error(error);
						console.log(us);


						var projection = d3.geo.albers()
							.center([0, 55.4])
							// .center([-98.5795, 39.8282])
							// .rotate([4.4, 0])
							.parallels([50, 60])
							.scale(2500)
							.translate([width / 2, height / 2]);


						var usa = d3.select('#map')
							.append('path')
							// .attr('fill', '#cdc')
							.datum(topojson.feature(us, us.objects.land))
							.attr('d', d3.geo.path().projection(projection))


					});




					var mapCities = d3.select('#map')
						.append('g')
						.attr('id', 'cities');

					var text = d3.select('#map')
						.append('text');


					mapper(cities);


					function mapper(gameData) {

						gameData.forEach(function(city) {

							var lat = city.location[0];
				    		var lon = city.location[1];

							var interpolX = buffer + ((lon - xMin)/xRange)*(svgWidth-2*buffer);
							var interpolY = buffer + (1-(lat - yMin)/yRange)*(svgHeight-2*buffer);

							mapCities.append('circle')
								.attr('id', city.name)
								.attr('cx', interpolX)
								.attr('cy', interpolY)
								.attr('r', 15);

							mapCities.append('text')
								.text(city.name)
								.attr("text-anchor", "middle")
								.attr('x', interpolX)
								.attr('y', interpolY+25)
								.attr("font-family", "sans-serif")
							   .attr("font-size", "11px")
							   .attr("fill", "black");
						})
					}

		 			
		 		}
		 	}, true)

					
		}
	}
})