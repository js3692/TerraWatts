app.factory('PlayGameFactory', function ($http, $q) {
    var baseUrl = '/api/grid/',
        gameId;
    
    function toData(response){
        return response.data;
    }
    
    return {
        continue: function(update, game){
            var toSend = { update: update, game: game };
            return $http.put(baseUrl + gameId)
                .return(toData);
        }  
    };
    
});