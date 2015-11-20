app.factory('GridFactory', function ($http) {
	var GridFactory = {};

	GridFactory.newGame = function() {
		return $http.post('/api/grid')
		.then(function (response) {
			console.log("response.data", response.data)
			return response.data;
		})
	}

	GridFactory.joinGame = function(gridId) {
		return $http.post('/api/grid/' + gridId + '/join')
		.then(function (response) {
			return response.data;
		})
	}

	GridFactory.leaveGame = function(gridId) {
		return $http.post('/api/grid/' + gridId + '/leave')
		.then(function (response) {
			return response.data;
		})
	}

	GridFactory.start = function(gridId) {
		return $http.put('/api/grid/' + gridId + '/start')
		.then(function (response) {
			return response.data;
		})
	}

	GridFactory.fetchOne = function(gridId) {
		return $http.get('/api/grid/' + gridId)
		.then(function (response) {
			return response.data;
		})
	}

	GridFactory.getJoinableGames = function() {
		return $http.get('/api/grid/canjoin')
		.then(function(response) {
            console.log(response.data);
			return response.data;
		})
	}
	return GridFactory;
})