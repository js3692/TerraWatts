app.factory('FirebaseFactory', function($firebaseObject, GridFactory){
    var baseUrl = "https://amber-torch-6713.firebaseio.com/",
        baseConnection = new Firebase(baseUrl),
        localConnection;
    
    return {
        getBase: function(){
            return baseConnection;  
        },
        setConnection: function(){
            return GridFactory.getCachedGrid()
                .then(function(grid){
                    localConnection = new Firebase(baseUrl + grid.key);
                    return localConnection;
                });
        },
        getConnection: function(){
            if(!localConnection) return this.setConnection();
            return localConnection;
        },
        getLiveJoinableGames: function(scope){
            if(!scope.games) return joinableGames;
            // The firebase object is not an array of games -- it also contains keys that aren't games.
            var joinableGames = [];
            for(let gameKey in scope.games){
                var gameObject = scope.games[gameKey]
                if(gameObject && gameObject.key === gameKey && !gameObject.game) joinableGames.push(gameObject);  
            }
            return joinableGames;
        }
    };
}); 