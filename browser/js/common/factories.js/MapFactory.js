app.factory('MapFactory', function ($http) {

	var MapFactory = {};

	MapFactory.drawConnections = function(connections, collection) {

		console.log('in it')

		var connectionVector = collection.selectAll('path')
			.data(connections).enter()
			.append('path')
			.attr('id', function(d) { return d.properties.cityNames; })
			.attr('class', 'connectionLines')
			.attr('fill', 'none');

	}

    return MapFactory;

});