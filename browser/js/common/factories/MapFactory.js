app.factory('MapFactory', function ($http) {

	var MapFactory = {};

	MapFactory.drawConnectionVector = function(connections, collection) {
		collection.selectAll('path')
			.data(connections).enter()
			.append('path')
			.attr('id', function(d) { return d.properties.cityNames; })
			.attr('class', 'connectionVector')
			.attr('fill', 'none');
	}

	MapFactory.drawConnectionDistVector = function(distMarkers, collection) {

	}

    return MapFactory;

});