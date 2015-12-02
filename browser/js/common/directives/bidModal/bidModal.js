app.controller('BidModalCtrl', function($scope, player, $uibModalInstance, plant, PlayGameFactory){
    
    $scope.plant = plant;
    
    $scope.bidForPlant = function(bid){
        console.log(player,'player');
        var update = {
            phase: 'plant',
            player: player,
            data: {
                plant: plant,
                bid: bid
            }
        };
        
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