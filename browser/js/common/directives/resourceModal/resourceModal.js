app.controller('ResourceModalCtrl', function($scope, player, $uibModalInstance, resources, resourceColors, PlayGameFactory){
    $scope.resources = resources;
    $scope.resourceColors = resourceColors;
    
    $scope.buyResources = function(wishlist){
        var update = {
            phase: 'resource',
            player: player,
            data: {
                wishlist: wishlist
            }
        };
        PlayGameFactory.continue(update);
    }
    
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})