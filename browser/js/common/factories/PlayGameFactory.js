app.factory('PlayGameFactory', function ($http, $q) {
    var baseUrl = '/api/grid/',
        gridId;
    
    function toData(response){
        return response.data;
    }
    
    return {
        continue: function(update, game){
            var toSend = { update: update, game: game };
            return $http.put(baseUrl + gridId)
                .return(toData);
        },
        setGrid: function(_gridId){
            gridId = _gridId;
        }
    };
    
});