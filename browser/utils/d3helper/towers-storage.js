(function() {

	var towers = {};

	towers.draw = function(cities, cityGroup, rectDimension) {

		console.log('cityGroup', cityGroup)

		var slot10Towers = d3.select(cityGroup)
			.append('g')
			.attr('id', 'slot10Towers')
			// .each(function(d,i) {
			// 	d3.select('#slot10Towers')
			// 		// .selectAll('rect')
			// 		// .data(cities)
			// 		// .enter()
			// 		.append('rect')
			// 		.attr('id', 'leftTower')
			// 		.attr('fill', 'grey')
			// 		.attr('stroke', 'black')
			// 		.attr('stroke-width', '1px')
			// 		// .attr('x', 100)
			// 		// .attr('y', 100)
			// 		.attr('width', rectDimension*.25)
			// 		.attr('height', rectDimension*.4);
			// })
		
		d3.select('#slot10Towers')
			.append('rect')
			.attr('id', 'leftTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px')
			.attr('width', rectDimension*.25)
			.attr('height', rectDimension*.4);

		

		var slot15Towers = d3.select(cityGroup)
			.append('g')
			.attr('id', 'slot15Towers');

		var slot20Towers = d3.select(cityGroup)
			.append('g')
			.attr('id', 'slot20Towers');

	}

	this.towers=towers;

})();