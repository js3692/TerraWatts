app.controller('GridCtrl', function ($scope, $state, theUser, BeforeGameFactory, FirebaseFactory, gridId, key) {
    $scope.grid = FirebaseFactory.getConnection(key);
    
	$scope.me = theUser;
    $scope.key = key;
    
    $scope.selected = theUser.color;
    $scope.colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
    $scope.changeColor = BeforeGameFactory.changeColor.bind(null, gridId, theUser._id)
    $scope.colorPicked = function(color){
        var players = $scope.grid.players;
        if(!players) return false;
        for(let i = 0, len = players.length; i < len; i++){
            if(color === players[i].color) return .4;
        }
        return false;
    };
    
    $scope.$watch('grid.game', function(game){
        if(game) $state.go('game', { id: gridId, key: key });
    });
    
	$scope.startGame = function() {
		BeforeGameFactory
            .start($scope.grid.id, $scope.grid.players)
            .then(function(updatedGrid){
                $state.go('game', { id: gridId, key: key });
            })
	}; 

	$scope.leaveGame = function() {
        BeforeGameFactory
            .leaveGame($scope.grid.id)
            .then(function() {
                $state.go('home');
            });
	};
})