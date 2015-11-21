app.controller('GridCtrl', function ($scope, $state, theGrid, thePlayer, GridFactory, $uibModalInstance) {

	$scope.grid = theGrid;
	$scope.me = thePlayer;
    
	$scope.startGame = function() {
		GridFactory
            .start($scope.grid._id)
            .then(function(updatedGrid){
                $state.go('game', { id: $scope.grid._id });
                $uibModalInstance.dismiss('cancel');
            })
	}

	$scope.leaveGame = function() {
		GridFactory.leaveGame($scope.grid._id)
		.then(function () {
			$uibModalInstance.dismiss('cancel');
		})
	}
})