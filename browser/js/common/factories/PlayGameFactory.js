app.factory('PlayGameFactory', function ($http, FirebaseFactory) {
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
    var factory = {};
    
    factory.continue = function(update){
        return $http.post(baseUrl + gridId, update)
            .then(toData);
    };
    factory.setGridId = function(_gridId){
        gridId = _gridId;
    };
    factory.setKey = function(_gridKey){
        gridKey = _gridKey;
    };
    factory.getKey = function(){
        return gridKey;  
    };
    factory.setPlayer = function(playerPromise){
        playerPromise.then(function(_player){
            player = _player;
        });
    };
    factory.getGrid = function() {
        if(gridKey) grid = FirebaseFactory.getConnection(gridKey);
        return grid;   
    };
    factory.getMe = function() {
        if(me) return me;
        if(grid && grid.players) {
            var players = grid.players;
            for(var i = 0, len = players.length; i < len; i++) {
                if(players[i].user._id === player._id) return me = players[i];
            }
        }
        return null;
    };
    factory.getTurnOrder = function(){
        if(grid && grid.game) {
            return grid.game.turnOrder;
        }
    };
    
    factory.getActivePlayer = function(){
        if(grid && grid.state) return grid.state.activePlayer; 
    };
    
    factory.getPlantMarket = function(){
            if(grid && grid.game) return grid.game.plantMarket;
    };
    
    factory.getResourceMarket = function(){
        if(grid && grid.game) return grid.game.resourceMarket;  
    };
    
    factory.setPlantToBidOn = function(plant){
        plantToBidOn = plant;  
    };
    
    factory.getPlantToBidOn = function(){
        return plantToBidOn;
    };
    
    factory.getGamePhase = function(){
        if(grid && grid.state) return grid.state.phase;
    };
    
    factory.iAmActivePlayer = function(){
        var me = factory.getMe();
        if(me) return me._id === factory.getActivePlayer();
    };
    
    factory.iAmActiveAuctionPlayer = function(){
        var auction = factory.getAuction();
        if(auction) return auction.activePlayer._id === factory.getMe()._id;
    }
    
    factory.getAuction = function(){
        if(grid && grid.state) return grid.state.auction;
    };

    factory.bid = {}
    
    return factory;
    
    
});