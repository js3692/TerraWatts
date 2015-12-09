app.directive('gameMap', function($parse, MapFactory, PlayGameFactory, CityCartFactory) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="map"></div>',
		scope: {
			grid: '=',
			cityCart: '='
		},
		link: function(scope, element, attrs) {

			var width = Math.max(960, window.innerWidth),
			    height = Math.max(500, window.innerHeight);

			var tile = d3.geo.tile()
			    .size([width, height]);

			var projection = d3.geo.mercator()
			    .scale((1 << 13) / 2 / Math.PI)
			    .translate([width / 2, height / 2]);

			var center = projection([-97, 39]);

			var zoom = d3.behavior.zoom()
			    .scale(projection.scale() * 2 * Math.PI)
			    .scaleExtent([1 << 13, 1 << 14])
			    .translate([width - center[0], height - center[1]])
			    .on("zoom", zoomed);

			var cityPath = d3.geo.path()
			    .pointRadius(zoom.scale()/800)
			    .projection(projection);

		    var connectionPath = d3.geo.path()
		    	.projection(projection);

	    	var distancePath = d3.geo.path()
			    .pointRadius(zoom.scale()/1200)
			    .projection(projection);

			var svg = d3.select(".map").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var raster = svg.append("g")
				.attr('class', 'Map Tiles');

			var connectionCollection = svg.append("g")
				.attr('class', 'Connections');

			var connectionDistCollection = svg.append("g")
				.attr('class', 'Connection Distances')
				.attr('fill', 'grey');

			var citiesCollection = svg.append("g")
				.attr('class', 'citiesCollection');

			var connectionDistVector,
				cityGroups,
				connectionVector,
				cityVector,
				distText,
				distCentroids = {},
				cityCentroids = {};

			// City Shape Variables:
			var cityWidth = zoom.scale()/105 > 120 ? 120 : zoom.scale()/105,
			// var cityWidth = 80,
				cityHeight = cityWidth/2,
				rectDimension = cityWidth/4,
				cityBoxBuffer = cityWidth/16,
				cityBoxYOffset = cityWidth*(3/16),
				textYOffset = cityWidth/8,
				textFontSize = cityWidth/8,
				leftTowerWidth = rectDimension*0.25,
				leftTowerHeight = rectDimension*0.5,
				midTowerWidth = rectDimension*0.3,
				midTowerHeight = rectDimension*0.8,
				rightTowerWidth = rectDimension*0.25,
				rightTowerHeight = rectDimension*0.65;

			function cityType(d) {
				return {
					type: 'Feature',
					properties: {name: d.name, region: d.region, id: d.id},
					geometry: {type: 'Point', coordinates: [d.location[1], d.location[0]]}
				}
			}

			function connectionDistType(d) {
				var coordinates = [(d.cities[0].location[1]+d.cities[1].location[1])/2, (d.cities[0].location[0]+d.cities[1].location[0])/2];
				return {
					type: 'Feature',
					properties: {distance: d.distance, cities: d.cities, cityNames: d.cityNames},
					geometry: {type: 'Point', coordinates: coordinates}
				}
			}

			function connectionType(d) {
				var coordinates = [[d.cities[0].location[1], d.cities[0].location[0]], [d.cities[1].location[1], d.cities[1].location[0]]];
				return {
					type: 'Feature',
					properties: {distance: d.distance, cities: d.cities, cityNames: d.cityNames},
					geometry: {type: 'LineString', coordinates: coordinates}
				}
			}
			

			var mapRendered = false;
			scope.$watch('grid.game', function(game) {
				if(game && !mapRendered) {
					mapRendered = true;
					const revisedCities = game.cities.map(function(city) { return cityType(city); });
					const revisedConnections = game.connections.map(function(connection) { return connectionType(connection); });
					const revisedDistMarkers = game.connections.map(function(connection) { return connectionDistType(connection); });

					var center = projection(MapFactory.getMapCenter(revisedCities));
				    zoom.translate([width - center[0], height - center[1]]);

					svg.call(zoom);

					cityGroups = citiesCollection.selectAll('g')
						.data(revisedCities).enter()
						.append('g')
						.on('click', function(d,i) {
							CityCartFactory.toggle(d.properties);
						});

					cityVector = cityGroups
						.each(function(d,i) {
							d3.select(this)
								.append('path')
								.attr('id', function(d,i) { return 'cityPath' + i; });

							var cityBox = d3.select(this)
								.append('rect')
								.attr('class', 'cityBox')
								.attr('width', cityWidth)
								.attr('height', cityHeight)
								.attr('rx', 5)
								.attr('ry', 5)
								.attr('fill', '#132330')
								.attr('opacity', 0.85)
								.attr('id', function(d,i) { return 'cityBox' + i; });

							var leftRect = d3.select(this)
								.append('rect')
								.attr('id', 'leftRect')
								.attr('width', rectDimension)
								.attr('height', rectDimension)
								.attr('rx', 2)
								.attr('ry', 2)
								.attr('x', cityBoxBuffer)
								.attr('y', cityBoxYOffset)
								.attr('fill', 'white')
								.attr('opacity', 0.95);

							var midRect = d3.select(this)
								.append('rect')
								.attr('id', 'midRect')
								.attr('width', rectDimension)
								.attr('height', rectDimension)
								.attr('rx', 2)
								.attr('ry', 2)
								.attr('x', 2*cityBoxBuffer + rectDimension)
								.attr('y', cityBoxYOffset)
								.attr('fill', 'white')
								.attr('opacity', 0.95);

							var rightRect = d3.select(this)
								.append('rect')
								.attr('id', 'rightRect')
								.attr('width', rectDimension)
								.attr('height', rectDimension)
								.attr('rx', 2)
								.attr('ry', 2)
								.attr('x', 3*cityBoxBuffer + 2*rectDimension)
								.attr('y', cityBoxYOffset)
								.attr('fill', 'white')
								.attr('opacity', 0.95);

							var cityText = d3.select(this)
								.append('text')
								.text(function(d) {return d.properties.name})
								.attr("text-anchor", "middle")
								.attr("font-family", "orbitron")
								.attr("font-size", textFontSize)
								.attr('word-spacing', '-.31em')
								.attr("fill", "white")
								.attr('x', cityWidth/2)
								.attr('y', textYOffset);

							var slot10Towers = d3.select(this)
								.append('g')
								.attr('id', 'slot10Towers')
								.each(function(d,j) {
									d3.select(this)
										.append('rect')
										.attr('id', 'leftTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', cityBoxBuffer + rectDimension/10)
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'midTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.3)
										.attr('height', 0)
										.attr('x', cityBoxBuffer + rectDimension*(7/20))
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'rightTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', cityBoxBuffer + rectDimension*(13/20))
										.attr('y', cityBoxYOffset + rectDimension);
								});

							var slot15Towers = d3.select(this)
								.append('g')
								.attr('id', 'slot15Towers')
								.each(function(d,j) {
									d3.select(this)
										.append('rect')
										.attr('id', 'leftTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', 2*cityBoxBuffer + rectDimension/10 + rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'midTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.3)
										.attr('height', 0)
										.attr('x', 2*cityBoxBuffer + rectDimension*(7/20) + rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'rightTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', 2*cityBoxBuffer + rectDimension*(13/20) + rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
								});

							var slot20Towers = d3.select(this)
								.append('g')
								.attr('id', 'slot20Towers')
								.each(function(d,j) {
									d3.select(this)
										.append('rect')
										.attr('id', 'leftTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', 3*cityBoxBuffer + rectDimension/10 + 2*rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'midTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.3)
										.attr('height', 0)
										.attr('x', 3*cityBoxBuffer + rectDimension*(7/20) + 2*rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
									d3.select(this)
										.append('rect')
										.attr('id', 'rightTower')
										.attr('fill', 'grey')
										.attr('stroke', 'black')
										.attr('stroke-width', '1px')
										.attr('width', rectDimension*.25)
										.attr('height', 0)
										.attr('x', 3*cityBoxBuffer + rectDimension*(13/20) + 2*rectDimension)
										.attr('y', cityBoxYOffset + rectDimension);
								});

						});

					connectionVector = connectionCollection.selectAll('path')
						.data(revisedConnections).enter()
						.append('path')
						.attr('id', function(d) { return d.properties.cityNames; })
						.attr('class', 'connectionLines')
						.attr('fill', 'none');

					connectionDistVector = connectionDistCollection.selectAll("path")
						.data(revisedDistMarkers).enter()
						.append('path')
						// .attr('opacity', 0.9)
						.attr('id', function(d,i) { return "path_" + i; });


					distText = connectionDistCollection.selectAll('text')
						.data(revisedDistMarkers).enter()
						.append('text')
						.text(function(d) { return d.properties.distance; })
						.attr("text-anchor", "middle")
						.attr('alignment-baseline', 'middle')
						.attr("font-family", "orbitron")
						.attr("fill", "white")

					zoomed();

				}

			}, true);

			var cartCounter = 0;
			scope.$watch('cityCart', function(cart) {
				cartCounter++
				d3.selectAll('#pulsingCity')
					.transition().duration(300)
					.attr('r', 0)
					.remove();
				if(cart.length) {
					var activePlayer = PlayGameFactory.getActivePlayer();
					var me = PlayGameFactory.getMe();
					if(activePlayer._id === me._id) {
						cart.forEach(function(city) {
							var cityName = city.name.replace(/[\s.,]/g, '');
							var pulsingCircle = d3.select('#' + cityName)
								.insert('circle', 'rect')
								.attr('id', 'pulsingCity')
								.attr('stroke', '#132330')
								.attr('stroke-width', 3)
								.attr('r', 20)
								.attr('cx', cityWidth/2)
								.attr('cy', cityHeight/2)
								.attr('opacity', 0.5);

							(function pulse() {
								pulsingCircle
									.transition().duration(1200)
									.attr('r', 50)
									.ease('sine')
									.transition().duration(1200)
									.attr('r', 20)
									.ease('sine')
									.each('end', pulse);
							})();
						});
					}
				}

			}, true);



			// Player watch
			scope.$watch('grid.players', function(players) {
				if(players) {
					d3.selectAll('#pulsingCity')
					.transition().duration(1000)
					.attr('r', 400)
					.attr('opacity', 0)
					.remove();

					var poppedCities = CityCartFactory.getPopulatedCities(players);
					poppedCities.forEach(function(city) {
						var cityName = city.name.replace(/[\s.,]/g, '');
						for(var i = 0; i < city.players.length; i++) {
							d3.select('#' + cityName + ' #slot' + (10+(i*5)) + 'Towers #leftTower')
								.transition()
								.duration(1000)
								.attr('height', leftTowerHeight)
								.attr('y', cityBoxYOffset + rectDimension - leftTowerHeight)
								.style('fill', d3.rgb(city.players[i].color).darker(0.6));

							d3.select('#' + cityName + ' #slot' + (10+(i*5)) + 'Towers #midTower')
								.transition()
								.duration(1000)
								.attr('height', midTowerHeight)
								.attr('y', cityBoxYOffset + rectDimension - midTowerHeight)
								.attr('fill', city.players[i].color);

							d3.select('#' + cityName + ' #slot' + (10+(i*5)) + 'Towers #rightTower')
								.transition()
								.duration(1000)
								.attr('height', rightTowerHeight)
								.attr('y', cityBoxYOffset + rectDimension - rightTowerHeight)
								.style('fill', d3.rgb(city.players[i].color).darker(0.3));
						}
					})



				}
			}, true);



			function renderOnCentroid() {
				distText
					.attr("transform", function(d,i) {return "translate(" + distCentroids[i] + ")"})
					.attr("font-size", function(d) {
						if(zoom.scale()/1000 < 10) return zoom.scale()/1000;
						return 10;
					});

				cityGroups
					.attr("transform", function(d,i) {
						var arr = [];
						arr.push(cityCentroids[i][0] - cityWidth/2);
						arr.push(cityCentroids[i][1] - cityHeight/2);
						return "translate(" + arr + ")"
					});
			}

			function zoomed() {
				var tiles = tile
			    	.scale(zoom.scale())
			    	.translate(zoom.translate())
			    	();

				projection
			    	.scale(zoom.scale() / 2 / Math.PI)
			    	.translate(zoom.translate());
		    	
		    	cityVector
		    		.attr('id', function(d) {
		    			var cityName = d.properties.name.replace(/[\s.,]/g, '');
		    			return cityName;
		    		})
		    		.attr('region', function(d) { return d.properties.region })
					.attr('d', cityPath)
					.attr('fill', 'none')
					.each(function(d,i) {
		    			cityCentroids[i] = cityPath.centroid(d);
					});

		    	connectionVector
			    	.attr('d', connectionPath);

		    	connectionDistVector
		    		.attr('distance', function(d) { return d.properties.distance })
		    		.attr('stroke', '#132330')
					.attr('stroke-width', '1px')
		    		.attr('d', distancePath)
		    		.each(function(d,i) {
		    			distCentroids[i] = distancePath.centroid(d);
					});

				renderOnCentroid();

	    		distancePath
	    			.pointRadius(zoom.scale()/1200);

				var image = raster
			    	.attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
			  		.selectAll("image")
			    	.data(tiles, function(d) { return d; });

				image.exit()
			    	.remove();

				image.enter().append("image")
			    	.attr("xlink:href", function(d) {
			    		// https://api.mapbox.com/v4/mapbox.comic.html?access_token=pk.eyJ1IjoibHVpc21hcnRpbnMiLCJhIjoiY2loZ2xsNnpwMG0xcnZia2x2Mnp3ZzYzMCJ9.huypgaYnUDo8wKLThRmyVQ#6/36.836/-99.294
			    		return "https://api.mapbox.com/v4/mapbox.satellite/" + d[2] + "/" + d[0] + "/" + d[1] + ".png?access_token=pk.eyJ1IjoibHVpc21hcnRpbnMiLCJhIjoiY2loZ2xsNnpwMG0xcnZia2x2Mnp3ZzYzMCJ9.huypgaYnUDo8wKLThRmyVQ"; })
			      		// return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
				    	// return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-1/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			    	.attr("width", 1)
			    	.attr("height", 1)
			    	.attr("x", function(d) { return d[0]; })
			    	.attr("y", function(d) { return d[1]; });
			}

					
		}
	}
});