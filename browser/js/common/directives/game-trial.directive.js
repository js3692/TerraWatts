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
		    var width = 2020,
			    height = 1090,
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
			    .attr("width", width)
			    .attr("height", height);

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
	 			var connections = gridGame.connections;

	 			console.log('gridGame', gridGame)
	 			
				var mapConnections = d3.select('#map')
					.append('g')
					.attr('id', 'connections')
					.attr('transform', 'scale(2)');

		    	var mapCities = d3.select('#map')
					.append('g')
					.attr('id', 'cities')
					.attr('transform', 'scale(2)');


				var text = d3.select('#map')
					.append('text');


				if(cities) {

					(function cityMapper(cities) {

						cities.forEach(function(city) {

							var lat = city.location[0],
								lon = city.location[1];

							mapCities.append('circle')
								.attr('id', city.name)
								.attr('r', 5)
								.attr('z-index', 200)
								.attr("transform", function(d) {return "translate(" + projection([lon,lat]) + ")"})

							mapCities.append('text')
								.text(city.name)
								.attr("text-anchor", "middle")
								.attr("transform", function(d) {return "translate(" + projection([lon,lat-0.5]) + ")"})
								.attr("font-family", "sans-serif")
								.attr("font-size", "5px")
								.attr("fill", "black");
						})
					})(cities);
	 			
	 			}


	 			if(connections) {
					console.log('connections', connections)

					connectionMapper(connections);

					function connectionMapper(connections) {

						connections.forEach(function(connection) {
							
							var firstLon = connection.cities[0].location[1],
								firstLat = connection.cities[0].location[0],
								secondLon = connection.cities[1].location[1],
								secondLat = connection.cities[1].location[0];

							console.log('firstLon', firstLon);
							console.log('firstLat', firstLat);
							console.log('secondLon', secondLon);
							console.log('secondLat', secondLat);

							var coordinates = [
								[firstLon, firstLat],
								[secondLon, secondLat],
							];
							var distance = connection.distance;

							mapConnections.append('path')
								.attr('fill', 'none')
								.attr('stroke', 'grey')
								.attr('d', function(d) {
									return path({
										type: 'LineString',
										coordinates: coordinates
									})
								})

							mapConnections.append('circle')
								.attr('id', connection.cityNames.join(", "))
								.attr('r', 5)
								.attr('fill', 'grey')
								.attr("transform", function(d) {return "translate(" + projection([(firstLon+secondLon)/2,(firstLat+secondLat)/2]) + ")"})

							mapConnections.append('text')
								.text(connection.distance)
								.attr("text-anchor", "middle")
								.attr('alignment-baseline', 'middle')
								.attr("transform", function(d) {return "translate(" + projection([(firstLon+secondLon)/2,(firstLat+secondLat)/2]) + ")"})
								.attr("font-family", "sans-serif")
								.attr("font-size", "5px")
								.attr("fill", "white");

						})

						

					};

				}



			}, true)


					
		}
	}
})