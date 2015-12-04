app.controller('GameCtrl', function($scope, FirebaseFactory, PlayGameFactory, thePlayer, gridId, key){
    $scope.key = key;
    $scope.grid = PlayGameFactory.getGrid();    
    $scope.showCityBuyPanel = false;
}); 