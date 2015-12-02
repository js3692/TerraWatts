app.controller('GameCtrl', function($scope, FirebaseFactory, thePlayer, gridId, key){
    $scope.me = function() {
        if($scope.grid.players){
            return $scope.grid.players.filter(function(player){
                return player.user._id === thePlayer._id;
            })[0];
        }
    }
    $scope.key = key;
    $scope.grid = FirebaseFactory.getConnection(key);
    $scope.$watch('grid.state', function(state){
        $scope.activePlayer = state && state.activePlayer;
    });
    
    $scope.gridGame = FirebaseFactory.getConnection(key + '/game');
}); 