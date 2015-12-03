app.directive('gameMap', function($parse) { //this is large - G&N
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="map"></div>',
		scope: {
			game: '=',
			grid: '=',
			me: '=',
			cityShoppingCart: '=ngModel'
		},
		link: function(scope, element, attrs) {

			var isActivePlayer = false;
			scope.cityShoppingCart = [];

			scope.$watch('me', function(me) {
				if(me && me._id === scope.grid.state.activePlayer) {
					console.log("You're the activePlayer! And special!!!")
					scope.showCityBuyPanel = true;
					isActivePlayer = true;
				}
			})

			var width = Math.max(960, window.innerWidth),
			    height = Math.max(500, window.innerHeight);

			var tile = d3.geo.tile() //d3 factory, maybe? this is a lot - G&N
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
			    .pointRadius(zoom.scale()/1600)
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
				.attr('class', 'Cities');

			var connectionDistVector,
				connectionVector,
				cityVector,
				distText,
				cityBox,
				cityRect,
				leftRect,
				midRect,
				rightRect,
				cityText,
				distCentroids = {},
				cityCentroids = {};

			// City Shape Variables:
			var cityWidth = zoom.scale()/110 > 120 ? 120 : zoom.scale()/110,
				cityHeight = cityWidth/2,
				rectDimension = cityWidth/4,
				cityBoxBuffer = cityWidth/16,
				cityBoxYOffset = cityWidth/16,
				textYOffset = cityWidth/8,
				textFontSize = cityWidth/8,
				leftTowerWidth = rectDimension*0.25,
				leftTowerHeight = rectDimension*0.4,
				midTowerWidth = rectDimension*0.3,
				midTowerHeight = rectDimension*0.8,
				rightTowerWidth = rectDimension*0.25,
				rightTowerHeight = rectDimension*0.6;

			function cityType(d) { //d? 
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


			scope.$watch('game', function(game) { //factory, again - G&N
				if(game.cities && game.connections) {
					var revisedCities = game.cities.map(function(city) { return cityType(city); });
					var revisedConnections = game.connections.map(function(connection) { return connectionType(connection); });
					var revisedDistMarkers = game.connections.map(function(connection) { return connectionDistType(connection); });

					svg.call(zoom);

					// connectionVector.datum({type: "FeatureCollection", features: revisedConnections});
					
					cityVector = citiesCollection.selectAll("path")
						.data(revisedCities)
						.enter()
						.append('path');

					connectionVector = connectionCollection.selectAll('path')
						.data(revisedConnections)
						.enter()
						.append('path')
						.attr('id', function(d) { return d.properties.cityNames; })
						.attr('fill', 'none')
						.attr('stroke', 'grey');

					connectionDistVector = connectionDistCollection.selectAll("path")
						.data(revisedDistMarkers)
						.enter()
						.append('path')
						.attr('id', function(d,i) { return "path_" + i; });

					distText = connectionDistCollection.selectAll('text')
						.data(revisedDistMarkers)
						.enter()
						.append('text')
						.text(function(d) { return d.properties.distance; })
						.attr("text-anchor", "middle")
						.attr('alignment-baseline', 'middle')
						.attr("font-family", "sans-serif")
						.attr("fill", "white");

					var cityBoxSelection = citiesCollection.selectAll('rect')
						.data(revisedCities)
						.enter();

					cityBox = cityBoxSelection
						.append('rect')
						.attr('class', 'cityBox')
						.attr('width', cityWidth)
						.attr('height', cityHeight)
						.attr('rx', 5)
						.attr('ry', 5)
						.attr('opacity', 0.8);

					leftRect = cityBoxSelection
						.append('rect')
						.attr('id', 'leftRect')
						.attr('width', rectDimension)
						.attr('height', rectDimension)
						.attr('rx', 2)
						.attr('ry', 2)
						.attr('fill', 'white');

					midRect = cityBoxSelection
						.append('rect')
						.attr('id', 'midRect')
						.attr('width', rectDimension)
						.attr('height', rectDimension)
						.attr('rx', 2)
						.attr('ry', 2)
						.attr('fill', 'white');

					rightRect = cityBoxSelection
						.append('rect')
						.attr('id', 'rightRect')
						.attr('width', rectDimension)
						.attr('height', rectDimension)
						.attr('rx', 2)
						.attr('ry', 2)
						.attr('fill', 'white');

					cityText = cityBoxSelection
						.append('text')
						.text(function(d) {return d.properties.name})
						.attr("text-anchor", "middle")
						.attr("font-family", "sans-serif")
						.attr("font-size", textFontSize)
						.attr("fill", "white");


					towers.draw(revisedCities, citiesCollection);

					for(var key in towers) {
						if(key.indexOf('left') > -1) {
							towers[key]
								.attr('width', leftTowerWidth)
								.attr('height', leftTowerHeight)
						} else if(key.indexOf('mid') > -1) {
							towers[key]
								.attr('width', midTowerWidth)
								.attr('height', midTowerHeight)
						} else if(key.indexOf('right') > -1) {
							towers[key]
								.attr('width', rightTowerWidth)
								.attr('height', rightTowerHeight)
						}
					}

					zoomed();
				}

			}, true);


			function renderOnCentroid() {
				distText
					.attr("transform", function(d,i) {return "translate(" + distCentroids[i] + ")"})
					.attr("font-size", function(d) {
						if(zoom.scale()/1000 < 10) return zoom.scale()/1000;
						return 10;
					});

				cityBox
					// .attr("transform", function(d,i) {return "translate(" + cityCentroids[i] + ")"})
					.attr('x', function(d,i) {return cityCentroids[i][0] - cityWidth/2})
					.attr('y', function(d,i) {return cityCentroids[i][1] - cityHeight/2})
					.on('click', function(d,i) {
						console.log("You've clicked " + d.properties.name)
						console.log('isActivePlayer', isActivePlayer)
						if(isActivePlayer) scope.cityShoppingCart.push(d.properties.id);
						console.log('cityShoppingCart', scope.cityShoppingCart)
					});

				leftRect
					.attr('x', function(d,i) {return cityCentroids[i][0] - 1.5*rectDimension - cityBoxBuffer})
					.attr('y', function(d,i) {return cityCentroids[i][1] - rectDimension/2 + cityBoxYOffset});

				midRect
					.attr('x', function(d,i) {return cityCentroids[i][0] - rectDimension/2})
					.attr('y', function(d,i) {return cityCentroids[i][1] - rectDimension/2 + cityBoxYOffset});

				rightRect
					.attr('x', function(d,i) {return cityCentroids[i][0] + 0.5*rectDimension + cityBoxBuffer})
					.attr('y', function(d,i) {return cityCentroids[i][1] - rectDimension/2 + cityBoxYOffset});

				cityText
					.attr('x', function(d,i) {return cityCentroids[i][0]})
					.attr('y', function(d,i) {return cityCentroids[i][1] - textYOffset});

				towers.leftTower10
					.attr('x', function(d,i) {return cityCentroids[i][0] - rectDimension - cityBoxBuffer - 1.5*leftTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - leftTowerHeight});

				towers.midTower10
					.attr('x', function(d,i) {return cityCentroids[i][0] - rectDimension - cityBoxBuffer - midTowerWidth/2})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - midTowerHeight});

				towers.rightTower10
					.attr('x', function(d,i) {return cityCentroids[i][0] - rectDimension - cityBoxBuffer - midTowerWidth/2 + rightTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - rightTowerHeight});

				towers.leftTower15
					.attr('x', function(d,i) {return cityCentroids[i][0] - 1.5*leftTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - leftTowerHeight});

				towers.midTower15
					.attr('x', function(d,i) {return cityCentroids[i][0] - midTowerWidth/2})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - midTowerHeight});

				towers.rightTower15
					.attr('x', function(d,i) {return cityCentroids[i][0] - midTowerWidth/2 + rightTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - rightTowerHeight});

				towers.leftTower20
					.attr('x', function(d,i) {return cityCentroids[i][0] + rectDimension + cityBoxBuffer - 1.5*leftTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - leftTowerHeight});

				towers.midTower20
					.attr('x', function(d,i) {return cityCentroids[i][0] + rectDimension + cityBoxBuffer - midTowerWidth/2})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - midTowerHeight});

				towers.rightTower20
					.attr('x', function(d,i) {return cityCentroids[i][0] + rectDimension + cityBoxBuffer - midTowerWidth/2 + rightTowerWidth})
					.attr('y', function(d,i) {return cityCentroids[i][1] + rectDimension/2 + cityBoxYOffset - rightTowerHeight});

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
		    		.attr('name', function(d) { return d.properties.name })
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
		    		.attr('d', distancePath)
		    		.each(function(d,i) {
		    			distCentroids[i] = distancePath.centroid(d);
					});

				renderOnCentroid();

		    	cityPath
		    		.pointRadius(zoom.scale()/800);

	    		distancePath
	    			.pointRadius(zoom.scale()/1600);

				var image = raster
			    	.attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
			  		.selectAll("image")
			    	.data(tiles, function(d) { return d; });

				image.exit()
			    	.remove();

				image.enter().append("image")
			    	.attr("xlink:href", function(d) {
			      		// return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
				    	return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-1/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			    	.attr("width", 1)
			    	.attr("height", 1)
			    	.attr("x", function(d) { return d[0]; })
			    	.attr("y", function(d) { return d[1]; });
			}

					
		}
	}
});