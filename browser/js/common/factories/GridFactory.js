app.factory('GridFactory', function ($http) {
	var baseUrl = '/api/grid/';
    var GridFactory = {};
    var cachedGrid;
    
    function toData(response){
        return response.data;
    }
    
    function updateCachedGrid(grid){
        cachedGrid = grid;
        return grid;
    }

	GridFactory.newGame = function() {
		return $http.post(baseUrl)
		.then(toData)
        .then(updateCachedGrid);
	}

	GridFactory.joinGame = function(gridId) {
		return $http.post(baseUrl + gridId + '/join')
		.then(toData)
        .then(updateCachedGrid);
	}

	GridFactory.leaveGame = function(gridId) {
		return $http.post(baseUrl + gridId + '/leave')
		.then(toData)
	}

	GridFactory.start = function(gridId) {
		return $http.put(baseUrl + gridId + '/start')
		.then(toData)
	}

	GridFactory.fetchOne = function(gridId) {
		return $http.get(baseUrl + gridId)
		.then(toData)
	}

	GridFactory.getJoinableGames = function() {
		return $http.get(baseUrl + 'canjoin')
		.then(toData)
	}
    
    GridFactory.getCachedGrid = function(id){
        if(id || !cachedGrid) return GridFactory.joinGame(id);
        return cachedGrid;
    }
    
	return GridFactory;
})