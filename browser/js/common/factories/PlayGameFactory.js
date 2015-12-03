app.factory('PlayGameFactory', function ($http, FirebaseFactory, $q) {
    var baseUrl = '/api/play/continue/',
        player,
        gridId,
        gridKey,
        grid,
        me,
        plantToBidOn;    

    function toData(response){
        return response.data;
    }
//    
    return {
        continue: function(update){
            return $http.post(baseUrl + gridId, update)
                .then(toData);
        },
        setGridId: function(_gridId){
            gridId = _gridId;
        },
        setKey: function(_gridKey){
            gridKey = _gridKey;
        },
        getKey: function(){
            return gridKey;  
        },
        setPlayer: function(playerPromise){
            playerPromise.then(function(_player){
                player = _player;
            });
        },
        getGrid: function() {
            if(gridKey) grid = FirebaseFactory.getConnection(gridKey);
            return grid;   
        },
        getMe: function() {
            if(me) return me;
            if(grid && grid.players) {
                var players = grid.players;
                for(var i = 0, len = players.length; i < len; i++) {
                    if(players[i].user._id === player._id) return me = players[i]; 
                }
            }
            return null;
        },
        getTurnOrder: function(){
            if(grid && grid.game) {
                return grid.game.turnOrder;
            }
        },
        getActivePlayer: function(){
            if(grid && grid.state) return grid.state.activePlayer; 
        },
        getPlantMarket: function(){
            if(grid && grid.game) return grid.game.plantMarket;
        },
        getResourceMarket: function(){
            if(grid && grid.game) return grid.game.resourceMarket;  
        },
        setPlantToBidOn: function(plant){
            plantToBidOn = plant;  
        },
        getPlantToBidOn: function(){
            return plantToBidOn;
        },
        bid: {}
    };
    
});