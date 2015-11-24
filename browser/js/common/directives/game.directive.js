app.directive('game', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="gameMap"></div>',
		controller: 'GameCtrl',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			// MOCK DATASET
			var dataset = [
		    	{name: 'Buffalo', lon: -78.8783689, lat: 42.88644679999999, slot10: null, slot15: null, slot20: null},
		    	{name: 'Pittsburg', lon: -79.9958864, lat: 40.44062479999999, slot10: 'player1', slot15: null, slot20: null},
		    	{name: 'Detroit', lon: -83.0457538, lat: 42.331427, slot10: 'player2', slot15: 'player1', slot20: null},
		    	{name: 'Cincinnati', lon: -84.5120196, lat: 39.1031182, slot10: 'player3', slot15: 'player2', slot20: 'player1'},
		    	{name: 'Atlanta', lon: -84.3879824, lat: 33.7489954, slot10: 'player3', slot15: 'player2', slot20: 'player1'},
		    	{name: 'San Francisco', lon: -122.4194155, lat: 37.7749295, slot10: 'player3', slot15: 'player2', slot20: 'player1'}
		    ];



		    var svgWidth = 800,
				svgHeight = 600,
				buffer = 40;



	    	var xBank = [],
	    		yBank = []
	    	dataset.forEach(function(city) {
	    		xBank.push(city.lon);
	    		yBank.push(city.lat);
	    	})
	    	var xMin = Math.min.apply(null, xBank),
	    		xMax = Math.max.apply(null, xBank),
	    		xRange = xMax-xMin,
	    		yMin = Math.min.apply(null, yBank),
	    		yMax = Math.max.apply(null, yBank),
	    		yRange = yMax-yMin;



			var map = d3.select('#gameMap')
				.append('svg')
				.attr('id', 'map')
				.attr('width', svgWidth) 
				.attr('height', svgHeight);

			var cities = d3.select('#map')
				.append('g')
				.attr('id', 'cities');

			var text = d3.select('#map')
				.append('text');


			mapper(dataset);


			function mapper(gameData) {

				gameData.forEach(function(city) {

					var interpolX = buffer + ((city.lon - xMin)/xRange)*(svgWidth-2*buffer);
					var interpolY = buffer + (1-(city.lat - yMin)/yRange)*(svgHeight-2*buffer);

					cities.append('circle')
						.attr('id', city.name)
						.attr('cx', interpolX)
						.attr('cy', interpolY)
						.attr('r', 15);

					cities.append('text')
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
	}
})