app.controller('GridCtrl', function ($scope, $state, thePlayer, GridFactory, gridConnection) {
    
    $scope.grid = gridConnection;
    
	$scope.me = thePlayer;
    
	$scope.startGame = function() {
		GridFactory
            .start($scope.grid.id)
            .then(function(updatedGrid){
                $state.go('game', { id: $scope.grid.id });
            })
	}; 

	$scope.leaveGame = function() {
		GridFactory.leaveGame($scope.grid.id)
		.then(function() {
			$state.go('home');
		})
	};
})