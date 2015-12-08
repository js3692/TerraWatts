app.factory('PlayGameFactory', function ($http, FirebaseFactory) {
    var baseUrl = '/api/play/continue/',
        chooseUrl = '/api/play/choose/',
        user,
        gridId,
        gridKey,
        grid,
        me,
        plantToBidOn,
        wishlist = {
            coal: 0,
            oil: 0,
            trash: 0,
            nuke: 0
        }, 
        resourcesForHybrids = {
            coal: 0,
            oil: 0
        };

    function toData(response){
        return response.data;
    }
    var PGFactory = {};
    
    PGFactory.continue = function(update){
        return $http.post(baseUrl + gridId, update)
            .then(toData);
    };  
    
    
    PGFactory.choose = function(update){
        return $http.post(chooseUrl + gridId, update)
            .then(toData);
    }
    
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
    
    PGFactory.getGame = function(){
        if(grid && grid.game) return grid.game;
    }
    
    PGFactory.getMe = function() {
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
        if(grid && grid.state) {
            if(grid.state.auction && grid.state.auction.choice) return "plantDiscard";
            else return grid.state.phase;
        }
    };
    
    PGFactory.iAmActivePlayer = function(){
        var me = PGFactory.getMe();
        if(me) return me._id === PGFactory.getActivePlayer()._id;
    };
    
    PGFactory.iAmActiveAuctionPlayer = function(){
        var auction = PGFactory.getAuction();
        if(auction) return auction.activePlayer._id === PGFactory.getMe()._id;
    }
    
    PGFactory.getWaitingOnPlayer = function(){
        if(PGFactory.iAmActiveAuctionPlayer() || PGFactory.iAmActiveDiscarder()) return null;
        if(PGFactory.iAmActivePlayer() && !PGFactory.getAuction()) return null;
        var auction = PGFactory.getAuction();
        
        if(auction) {
            if(auction.choice) return auction.choice.player.user.username;
            else return auction.activePlayer.user.username;
        } else {
            var activePlayer = PGFactory.getActivePlayer();
            if(activePlayer) return activePlayer.user.username;
        }
    }
    
    PGFactory.iAmActiveDiscarder = function(){
        var auction = PGFactory.getAuction();
        if(auction && auction.choice) { 
            return auction.choice.player._id === PGFactory.getMe()._id; 
        }
    }
    
    PGFactory.getActiveDiscarder = function(){
        var auction = PGFactory.getAuction();
        if(auction) return auction.choice.player;
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
    
    
    
    PGFactory.getResourcesToUseForHybrids = function(){
        return resourcesForHybrids;
    }
    
    PGFactory.changeResourcesToUseForHybrids = function(resourceType, quantity){
        resourcesForHybrids[resourceType] += quantity;
    }
    
    PGFactory.clearResourcesToUseForHybrids = function(){
        resourcesForHybrids = {
            oil: 0,
            coal: 0
        };
    }
    
    PGFactory.clearWishlist = function() {
        wishlist = {
            coal: 0,
            oil: 0,
            trash: 0,
            nuke: 0
        }; 
    }

    PGFactory.getMyPlants = function(){
        return PGFactory.getMe().plants;
    }
    
    PGFactory.getMyCities = function(){
        return PGFactory.getMe().cities;
    }
    
    PGFactory.getMyResources = function(){
        return PGFactory.getMe().resources;
    }
    
    PGFactory.getStep = function(){
        return +PGFactory.getGame().step;
    }
    
    PGFactory.getTurn = function(){
        return PGFactory.getGame().turn;
    }
    
    PGFactory.getStep = function(){
        return PGFactory.getGame().step;
    }
    
    return PGFactory;
    
    
});