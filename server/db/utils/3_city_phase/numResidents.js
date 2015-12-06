module.exports = function numResidents (city, players) {
	return players.reduce(function (prev, player) {
		var isResident = 0;
		player.cities.forEach(function (c) {
			console.log('in numResidents', c, city)
			if (c === city.id || (c.equals && c.equals(city.id)) || (c._id && c._id.equals(city.id))) isResident = 1;
		});
		return prev + isResident;
	}, 0)
}