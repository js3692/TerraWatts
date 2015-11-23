app.directive('game', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div><div id="tooltip"><div id="gameMap"></div></div>',
		controller: 'GameCtrl',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			// scope.$watch will hopefully be unnecessary down the line
			scope.$watch('data', function(dataset, oldData) {
				if(dataset) {

					var svgWidth = 1280,
						svgHeight = 800;

					var map = d3.select('#gameMap').append('svg')
						.attr('width', svgWidth) 
						.attr('height', svgHeight)

					mapper(dataset);

					function mapper(gameData) {
						var cities = map.selectAll('g.cities')

						var city = map.selectAll('circle')

						city.enter().insert('svg:circle', 'g')
							.attr('name', function(d){return d.name})
							.attr('cx', function(d){return d.x})
							.attr('cy', function(d){return d.y})
							.attr('r', 20)
							.attr('slot10', function(d){return d.slot10.player.color})
							.attr('slot15', function(d){return d.slot15.player.color})
							.attr('slot20', function(d){return d.slot20.player.color})
							.on('mouseover', mouseOver)
							.on('mouseout', mouseOut);

						var path = map.selectAll('g.connection')

						path.enter().insert('svg:g')
							.append('path')
							.attr('class', 'connection')
							.attr('distance', function(d) {return d.distance})
							.attr('d', function(d) {
								var path = "M" + d.cityNames[0].x + "," + d.cityNames[0].y + "L" + d.cityNames[1].x + "," + d.cityNames[1].y
							});
					}
					
				}
			})


		}
	}
})