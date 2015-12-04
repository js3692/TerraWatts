app.controller('GameCtrl', function($scope, FirebaseFactory, PlayGameFactory, theUser, gridId, key){
    $scope.key = key;
    $scope.grid = PlayGameFactory.getGrid();    
    $scope.showCityBuyPanel = false;
}); 