app.factory('FirebaseFactory', function($firebaseObject, GridFactory){
    var baseUrl = "https://amber-torch-6713.firebaseio.com/";
    var connection;
    
    return {
        setConnection: function(){
            return GridFactory.getCachedGrid()
                .then(function(grid){
                    connection = new Firebase(baseUrl + grid.key);
                    return connection;
                });
        },
        getConnection: function(){
            if(!connection) return this.setConnection();
            return connection;
        }
    };
}); 