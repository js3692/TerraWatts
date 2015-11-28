app.directive('zoomMap', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="map"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			var width = Math.max(960, window.innerWidth),
			    height = Math.max(500, window.innerHeight),
			    pointRadius = 10;

			var tile = d3.geo.tile()
			    .size([width, height]);

			var projection = d3.geo.mercator()
			    .scale((1 << 12) / 2 / Math.PI)
			    .translate([width / 2, height / 2]);

			var center = projection([-100, 40]);

			var zoom = d3.behavior.zoom()
			    .scale(projection.scale() * 2 * Math.PI)
			    .scaleExtent([1 << 11, 1 << 14])
			    .translate([width - center[0], height - center[1]])
			    .on("zoom", zoomed);

		    const initZoomScale = zoom.scale();


			var cityPath = d3.geo.path()
			    .pointRadius(zoom.scale()/800)
			    .projection(projection)
			    // .call(zoom);

		    var cityCircle = d3.geo.circle()
		    	.origin([-100, 40])
		    	.call(zoom);


		    var connectionPath = d3.geo.path()
		    	.projection(projection)

	    	var distancePath = d3.geo.path()
			    .pointRadius(zoom.scale()/1600)
			    .projection(projection);


			
			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var raster = svg.append("g");


			var connectionVector = svg.append("path")
				.attr('class', 'connections')
				.attr('fill', 'none')
				.attr('stroke', 'grey');

			var connectionDistVector = svg.append("path")
				.attr('class', 'connectionDistances');

			// var cityVector = svg.append("path")
			// 	.attr('class', 'cities');

			var cityVector = svg.append("circle")
				.attr('class', 'cities');


			scope.$watch('data', function(newData, oldData) {
				var cities = newData.cities;
				var connections = newData.connections;

				// if(cities) {
				// 	var revisedCities = cities.map(function(city) {
				// 		return type(city);
				// 	});
					
				// 	console.log('revisedCities', revisedCities)

				// 	svg.call(zoom);
				// 	cityVector.datum({type: "FeatureCollection", features: revisedCities})
				// 	zoomed();
				// }



				if(cities) {
					console.log('cities', cities)

					svg.call(zoom);
					zoomed();

					cities.forEach(function(city) {
						var lonlat = [city.location[1], city.location[0]];
						console.log('lonlat', lonlat)
						var xy = projection(lonlat);
						console.log('xy', xy)


						cityVector
							.attr('transform', function(d) {
								return "translate(" + projection(lonlat) + ")";
							})
							.attr('r', 50)



					})
				}

				if(connections) {
					console.log('connections', connections)

					var revisedConnections = connections.map(function(connection) {
						return connectionType(connection);
					})
					console.log('revisedConnections', revisedConnections)

					var revisedDistMarkers = connections.map(function(connection) {
						return connectionDistType(connection);
					})
					console.log('revisedDistMarkers', revisedDistMarkers)

					// svg.call(zoom);
					connectionVector.datum({type: "FeatureCollection", features: revisedConnections})
					connectionDistVector.datum({type: "FeatureCollection", features: revisedDistMarkers})
					zoomed();

				}
			}, true);


			function type(d) {
				return {
					type: 'Feature',
					properties: {
						name: d.name,
						state: 'temp'
					},
					geometry: {
						type: 'Point',
						coordinates: [d.location[1], d.location[0]]
					}
				}
			}

			function connectionDistType(d) {
				var firstLon = d.cities[0].location[1],
					firstLat = d.cities[0].location[0],
					secondLon = d.cities[1].location[1],
					secondLat = d.cities[1].location[0];

				var coordinates = [ (firstLon+secondLon)/2, (firstLat+secondLat)/2 ]

				return {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: coordinates
					}
				}
			}

			function connectionType(d) {
				var firstLon = d.cities[0].location[1],
					firstLat = d.cities[0].location[0],
					secondLon = d.cities[1].location[1],
					secondLat = d.cities[1].location[0];

				var coordinates = [
					[firstLon, firstLat],
					[secondLon, secondLat],
				];

				return {
					type: 'Feature',
					// properties: {
					// 	name: d.name,
					// 	state: 'temp'
					// },
					geometry: {
						type: 'LineString',
						coordinates: coordinates
					}
				}
			}

			function zoomed() {
				var tiles = tile
			    	.scale(zoom.scale())
			    	.translate(zoom.translate())
			    	();

				projection
			    	.scale(zoom.scale() / 2 / Math.PI)
			    	.translate(zoom.translate());
		    	
		    	// cityVector
			    // 	.attr("d", cityPath)

			    cityVector
			    	.attr('d', function(d) {console.log('d', d)})
			    	.attr("d", cityCircle)

		    	connectionVector
			    	.attr('d', connectionPath)

		    	connectionDistVector
		    		.attr('d', distancePath)

		    	cityPath
		    		.pointRadius(zoom.scale()/800);

	    		distancePath
	    			.pointRadius(zoom.scale()/1600);

	    		// console.log('zoom.scale()', zoom.scale())
	    		// console.log('initZoomScale', initZoomScale)

				var image = raster
			    	.attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
			  		.selectAll("image")
			    	.data(tiles, function(d) { return d; });

				image.exit()
			    	.remove();

				image.enter().append("image")
			    	.attr("xlink:href", function(d) {
			      		return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			    	.attr("width", 1)
			    	.attr("height", 1)
			    	.attr("x", function(d) { return d[0]; })
			    	.attr("y", function(d) { return d[1]; });
			}
			
		 	

					
		}
	}
})