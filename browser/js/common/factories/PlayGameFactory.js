app.factory('PlayGameFactory', function ($http, $q) {
    var baseUrl = '/api/play/continue/',
        gridId;
    
    function toData(response){
        return response.data;
    }
    
    return {
        continue: function(update){
            return $http.post(baseUrl + gridId, update)
                .then(toData);
        },
        setGrid: function(_gridId){
            gridId = _gridId;
        }
    };
    
});