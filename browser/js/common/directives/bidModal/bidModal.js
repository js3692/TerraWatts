app.controller('BidModalCtrl', function($scope, player, players, auction, $uibModalInstance, plant, PlayGameFactory){
    $scope.auction = auction;
    $scope.plant = plant;
    $scope.playersInAuction = !auction || auction.remainingPlayers.map(function(playerId){ //boolean || array? - G&N
        for(var i = 0; i < players.length; i++){
            if(players[i]._id === playerId) return players[i];
        }  
    });
    
    $scope.isActivePlayer = function(player){
        return player._id === auction.activePlayer;
    }
    
    var update = {
            phase: 'plant',
            player: player,
            data: {
                plant: plant
            }
        };
    
    $scope.bidForPlant = function(bid){
        update.data.bid = bid;
        
        PlayGameFactory.continue(update);
        $scope.ok();
    }
    
    $scope.pass = function(){
        update.data = 'pass';
        PlayGameFactory.continue(update);
        $scope.ok();
    }
    
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})