app.controller('GameCtrl', function($scope, FirebaseFactory, thePlayer, gridId, key){
    
    $scope.key = key;
    $scope.grid = FirebaseFactory.getConnection(key);

    $scope.showCityBuyPanel = false;

    $scope.$watch('grid.state', function(state){
        $scope.activePlayer = state && state.activePlayer;
    });
    
    $scope.me = function() {
        var players = $scope.grid.players;
        if(players){
            for(var i = 0; i < players.length; i++){
                if(players[i].user._id === thePlayer._id) return players[i];
            }
        }
    };

    $scope.gridGame = FirebaseFactory.getConnection(key + '/game');
}); 