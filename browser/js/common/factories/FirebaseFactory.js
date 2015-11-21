app.factory('FirebaseFactory', function($firebaseObject, GridFactory){
    var baseUrl = "https://amber-torch-6713.firebaseio.com/";
   
    return {
        getConnection: function(){
            var grid = GridFactory.getCachedGrid();
            return new Firebase(baseUrl + grid.key);
        }
    };
}); 