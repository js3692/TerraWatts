app.factory('MapFactory', function ($http) {

	var MapFactory = {};

	MapFactory.getMapCenter = function(cities) {
		var lons = [],
			lats = [],
			lonSum = 0,
			latSum = 0,
			center = [];
		cities.forEach(function(city) {
			lons.push(city.geometry.coordinates[0]);
			lats.push(city.geometry.coordinates[1]);
		});
		for(var i = 0; i < lons.length; i++) {
			lonSum += lons[i];
			latSum += lats[i];
		}
		return [(lonSum/cities.length), (latSum/cities.length)];
	}

	MapFactory.cityTypeMapper = function(cities) {
		return cities.map(function(city) {
			return {
				type: 'Feature',
				properties: {name: city.name, region: city.region, id: city.id},
				geometry: {type: 'Point', coordinates: [city.location[1], city.location[0]]}
			}
		});
	}

	MapFactory.connectionTypeMapper = function(connections) {
		return connections.map(function(c) {
			var coordinates = [[c.cities[0].location[1], c.cities[0].location[0]], [c.cities[1].location[1], c.cities[1].location[0]]];
			return {
				type: 'Feature',
				properties: {distance: c.distance, cities: c.cities, cityNames: c.cityNames},
				geometry: {type: 'LineString', coordinates: coordinates}
			}
		});
	}

	MapFactory.connectionDistTypeMapper = function(connections) {
		return connections.map(function(c) {
			var coordinates = [(c.cities[0].location[1]+c.cities[1].location[1])/2, (c.cities[0].location[0]+c.cities[1].location[0])/2];
			return {
				type: 'Feature',
				properties: {distance: c.distance, cities: c.cities, cityNames: c.cityNames},
				geometry: {type: 'Point', coordinates: coordinates}
			}
		});
	}

	MapFactory.drawConnections = function(collection, connections) {
		collection.selectAll('path')
			.data(connections).enter()
			.append('path')
			.attr('id', function(d) { return d.properties.cityNames; })
			.attr('class', 'connectionLines')
			.attr('fill', 'none');
	}

	MapFactory.drawConnectionDists = function(collection, connectionDists) {
		collection.selectAll("path")
			.data(connectionDists).enter()
			.append('path')
			.attr('id', function(d,i) { return "path_" + i; })
			.attr('class', 'connectionDists');

		collection.selectAll('text')
			.data(connectionDists).enter()
			.append('text')
			.text(function(d) { return d.properties.distance; })
			.attr('class', 'distText')
			.attr("text-anchor", "middle")
			.attr('alignment-baseline', 'middle')
			.attr("font-family", "orbitron")
			.attr("fill", "white")
	}

	MapFactory.drawCities = function(collection, cityWidth) {
		var cityHeight = cityWidth/2,
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

		collection
			.attr('class', 'cityVector')
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
	}

    return MapFactory;

});