app.controller('GameCtrl', function($scope, FirebaseFactory, gridId, key){
    $scope.grid = FirebaseFactory.getConnection(key);
    $scope.gridGame = FirebaseFactory.getConnection(key + '/game');
}); 