app.controller('ResourceModalCtrl', function($scope, $uibModalInstance, resources, resourceColors){
    $scope.resources = resources;
    $scope.resourceColors = resourceColors;
    
    $scope.buyResources = function(){
        console.log($scope.bid);
    }
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})