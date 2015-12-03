module.exports = function numResidents (city, players) {
	return players.reduce(function (prev, player) {
		var isResident = 0;
		player.cities.forEach(function (c) {
			console.log('in num residents c', c)
			console.log('in num residents city', city)
			if (c === city.id) isResident = 1;
		});
		return prev + isResident;
	}, 0)
}