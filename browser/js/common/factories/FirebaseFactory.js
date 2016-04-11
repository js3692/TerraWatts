app.factory('FirebaseFactory', function($firebaseObject){
    var baseUrl = "https://amber-torch-6713.firebaseio.com/",
        baseConnection = $firebaseObject(new Firebase(baseUrl)),
        localConnection;

    return {
        getBase: function(){
            return baseConnection;
        },
        setConnection: function(key){
            localConnection = $firebaseObject(new Firebase(baseUrl + key));
            return localConnection;
        },
        getConnection: function(key){
            if(key) return this.setConnection(key);
            return localConnection;
        },
        getAllGrids: function(scope){
            var allGrids = [];
            if(!scope.grids) return allGrids;

            for(let gridKey in scope.grids) {
                var grid = scope.grids[gridKey]
                if(grid && gridKey[0] === '-') allGrids.push(grid);
            }
            return allGrids;
        },
        getChat: function(key){
            if(key) return new Firebase(baseUrl + key + '/chat');
        }
    };
});
