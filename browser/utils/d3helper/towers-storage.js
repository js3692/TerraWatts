(function() {

	var towers = {};

	towers.draw = function(revisedCities, citiesCollection) {

		citiesCollection.append("g")
			.attr('class', 'Towers');


		d3.select('.Towers').append("g")
			.attr('class', 'Slot10Towers');

		d3.select('.Slot10Towers').append("g")
			.attr('class', 'Slot10LeftTowers');
		
		d3.select('.Slot10Towers').append("g")
			.attr('class', 'Slot10RightTowers');

		d3.select('.Slot10Towers').append("g")
			.attr('class', 'Slot10MidTowers');

		towers.leftTower10 = d3.select('.Slot10LeftTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'leftTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.midTower10 = d3.select('.Slot10MidTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'midTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.rightTower10 = d3.select('.Slot10RightTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'rightTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');



		d3.select('.Towers').append("g")
			.attr('class', 'Slot15Towers');

		d3.select('.Slot15Towers').append("g")
			.attr('class', 'Slot15LeftTowers');
		
		d3.select('.Slot15Towers').append("g")
			.attr('class', 'Slot15RightTowers');

		d3.select('.Slot15Towers').append("g")
			.attr('class', 'Slot15MidTowers');

		towers.leftTower15 = d3.select('.Slot15LeftTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'leftTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.midTower15 = d3.select('.Slot15MidTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'midTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.rightTower15 = d3.select('.Slot15RightTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'rightTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');



		d3.select('.Towers').append("g")
			.attr('class', 'Slot20Towers');

		d3.select('.Slot20Towers').append("g")
			.attr('class', 'Slot20LeftTowers');
		
		d3.select('.Slot20Towers').append("g")
			.attr('class', 'Slot20RightTowers');

		d3.select('.Slot20Towers').append("g")
			.attr('class', 'Slot20MidTowers');

		towers.leftTower20 = d3.select('.Slot20LeftTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'leftTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.midTower20 = d3.select('.Slot20MidTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'midTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

		towers.rightTower20 = d3.select('.Slot20RightTowers').selectAll('rect')
			.data(revisedCities)
			.enter()
			.append('rect')
			.attr('id', 'rightTower')
			.attr('fill', 'grey')
			.attr('stroke', 'black')
			.attr('stroke-width', '1px');

	}

	this.towers=towers;

})();