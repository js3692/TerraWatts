app.directive('gametrial', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="gameMapTrial"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			// Map START

		    var width = 960,
			    height = 500,
			    buffer = 40,
			    centerLon = -96,
			    centerLat = 38.3;

			var projection = d3.geo.mercator()
			    .center([centerLon, centerLat])
			    .scale(890);

			var path = d3.geo.path()
			    .projection(projection);

			var tile = d3.geo.tile()
			    .scale(projection.scale() * 2 * Math.PI)
			    .translate(projection([0, 0]))
			    .zoomDelta((window.devicePixelRatio || 1) - .5);


			var svg = d3.select("#gameMapTrial").append("svg")
				.attr('id', 'map')
				// .attr('viewBox', '0 0 960 500')
			    .attr("width", 2020)
			    .attr("height", 1075);

			d3.json("/utils/maps/us.json", function(error, topology) {
			  if (error) throw error;

			  var tiles = tile();

			  var defs = svg.append("defs");

			  // USA Outline
			  defs.append("path")
			      .attr("id", "land")
			      .attr('transform', 'scale(2)')
			      .datum(topojson.feature(topology, topology.objects.land))
			      .attr("d", path);

			  defs.append("clipPath")
			      .attr("id", "clip")
			    .append("use")
			      .attr("xlink:href", "#land");

			  svg.append("g")
			  	.attr('transform', 'scale(2)')
			      .attr("clip-path", "url(#clip)")

			    .selectAll("image")
			      .data(tiles)
			    .enter().append("image")
			      .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-2/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			      .attr("width", Math.round(tiles.scale))
			      .attr("height", Math.round(tiles.scale))
			      .attr("x", function(d) { return Math.round((d[0] + tiles.translate[0]) * tiles.scale); })
			      .attr("y", function(d) { return Math.round((d[1] + tiles.translate[1]) * tiles.scale); });

			  svg.append("use")
			      .attr("xlink:href", "#land")
			      .attr("class", "stroke");
			});
			// Map END

			// Cities START
			scope.$watch('data', function(newData, oldData) {
				var gridGame = newData;
	 			var cities = gridGame.cities;

	 			if(cities) {
	 				console.log('cities', cities)

	 				// var xBank = [],
			   //  		yBank = []
			   //  	cities.forEach(function(city) {
			   //  		var lat = city.location[0];
			   //  		var lon = city.location[1];
			   //  		xBank.push(lon);
			   //  		yBank.push(lat);
			   //  	})
			   //  	var xMin = Math.min.apply(null, xBank),
			   //  		xMax = Math.max.apply(null, xBank),
			   //  		xRange = xMax-xMin,
			   //  		yMin = Math.min.apply(null, yBank),
			   //  		yMax = Math.max.apply(null, yBank),
			   //  		yRange = yMax-yMin;



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

							// var interpolX = buffer + ((lon - xMin)/xRange)*(width-2*buffer);
							// var interpolY = buffer + (1-(lat - yMin)/yRange)*(height-2*buffer);

							mapCities.append('circle')
								.attr('id', city.name)
								// .attr('cx', lon)
								// .attr('cy', lat)
								.attr('cx', 200)
								.attr('cy', 200)
								.attr('r', 15);

							mapCities.append('text')
								.text(city.name)
								.attr("text-anchor", "middle")
								.attr('x', 200)
								.attr('y', 200)
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