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

	MapFactory.drawConnectionVector = function(connections, collection) {
		collection.selectAll('path')
			.data(connections).enter()
			.append('path')
			.attr('id', function(d) { return d.properties.cityNames; })
			.attr('class', 'connectionVector')
			.attr('fill', 'none');
	}

    return MapFactory;

});