app.factory('GridFactory', function ($http, $q) {
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
    
    function organizePlayersForStart(users){
        return users.map(user => { return { user: user, color: user.color }});
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

	GridFactory.start = function(gridId, users) {
		return $http.put(baseUrl + gridId + '/start', organizePlayersForStart(users))
		  .then(toData);
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
        if(id && !cachedGrid) return GridFactory.fetchOne(id);
        return $q.resolve(cachedGrid);
    }
    
    GridFactory.changeColor = function(id, userId, color){
        return $http.put(baseUrl + id + '/changeColor', { userId: userId, color: color })
            .then(toData);
            
    }
	return GridFactory;
})