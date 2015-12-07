app.controller('GameCtrl', function($scope, FirebaseFactory, PlayGameFactory, CityCartFactory, theUser, gridId, key){
    $scope.key = key;
    $scope.grid = PlayGameFactory.getGrid();
    $scope.cityCart = CityCartFactory.getCart();
    $scope.showCityBuyPanel = false;
}); 