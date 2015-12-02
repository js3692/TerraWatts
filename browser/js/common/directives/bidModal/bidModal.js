app.controller('BidModalCtrl', function($scope, player, $uibModalInstance, plant, PlayGameFactory){
    
    $scope.plant = plant;
    
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