app.factory('PlayGameFactory', function ($http, FirebaseFactory) {
    var baseUrl = '/api/play/continue/',
        user,
        gridId,
        gridKey,
        grid,
        me,
        plantToBidOn,
        wishlist = {
            oil: 0,
            trash: 0,
            coal: 0,
            nuke: 0
        };    

    function toData(response){
        return response.data;
    }
    var PGFactory = {};
    
    PGFactory.continue = function(update){
        return $http.post(baseUrl + gridId, update)
            .then(toData);
    };  
    
    PGFactory.setGridId = function(_gridId){
        gridId = _gridId;
    };
    
    PGFactory.setKey = function(_gridKey){
        gridKey = _gridKey;
    };
    
    PGFactory.getKey = function(){
        return gridKey;  
    };
    
    PGFactory.setUser = function(userPromise){
        userPromise.then(function(_user){
            user = _user;
        });
    };
    
    PGFactory.getGrid = function() {
        if(gridKey) grid = FirebaseFactory.getConnection(gridKey);
        return grid;   
    };
    
    PGFactory.getMe = function() {
        if(me) return me;
        if(grid && grid.players) {
            var players = grid.players;
            for(var i = 0, len = players.length; i < len; i++) {
                if(players[i].user._id === user._id) return me = players[i];
            }
        }
        return null;
    };
    
    PGFactory.getTurnOrder = function(){
        if(grid && grid.game) {
            return grid.game.turnOrder;
        }
    };
    
    PGFactory.getActivePlayer = function(){
        if(grid && grid.state) {
            return grid.state.activePlayer; }
    };
    
    PGFactory.getPlantMarket = function(){
            if(grid && grid.game) return grid.game.plantMarket;
    };
    
    PGFactory.getResourceMarket = function(){
        if(grid && grid.game) return grid.game.resourceMarket;  
    };
    
    PGFactory.setPlantToBidOn = function(plant){
        plantToBidOn = plant;  
    };
    
    PGFactory.getPlantToBidOn = function(){
        return plantToBidOn;
    };
    
    PGFactory.getGamePhase = function(){
        if(grid && grid.state) return grid.state.phase;
    };
    
    PGFactory.iAmActivePlayer = function(){
        var me = PGFactory.getMe();
        if(me) return me._id === PGFactory.getActivePlayer()._id;
    };
    
    PGFactory.iAmActiveAuctionPlayer = function(){
        var auction = PGFactory.getAuction();
        if(auction) return auction.activePlayer._id === PGFactory.getMe()._id;
    }
    
    PGFactory.getAuction = function(){
        if(grid && grid.state) return grid.state.auction;
    };
    
    PGFactory.changeWishlist = function(resourceType, quantity){
        wishlist[resourceType] += +quantity;
    }
    
    PGFactory.getWishlist = function(){
        return wishlist;
    }

    PGFactory.bid = {}
    
    return PGFactory;
    
    
});