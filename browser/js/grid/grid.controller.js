app.controller('GridCtrl', function ($scope, $state, thePlayer, GridFactory, FirebaseFactory, gridId, key) {
    
    $scope.grid = FirebaseFactory.getConnection(key);
    
	$scope.me = thePlayer;
    $scope.selected = thePlayer.color;
    $scope.colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
    
    $scope.$watch('selected', function(color) {
        GridFactory.changeColor(gridId, thePlayer._id, color);
    });
    
    $scope.$watch('grid.game', function(game){
        if(game) $state.go('game', { id: gridId, key: key });
    })
    
	$scope.startGame = function() {
		GridFactory
            .start($scope.grid.id, $scope.grid.users)
            .then(function(updatedGrid){
                $state.go('game', { id: gridId, key: key });
            })
	}; 

	$scope.leaveGame = function() {
		GridFactory.leaveGame($scope.grid.id)
		.then(function() {
			$state.go('home');
		})
	};
})