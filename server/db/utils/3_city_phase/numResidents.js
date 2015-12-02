module.exports = function numResidents (city, players) {
	return players.reduce(function (prev, player) {
		var isResident = 0;
		player.cities.forEach(function (c) {
			if (c._id.equals(city._id)) isResident = 1;
		});
		return prev + isResident;
	}, 0)
}