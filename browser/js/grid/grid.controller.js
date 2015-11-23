app.controller('GridCtrl', function ($scope, $state, thePlayer, GridFactory, $uibModalInstance, firebaseConnection, $firebaseObject) {
    
    var syncObject = $firebaseObject(firebaseConnection);
    syncObject.$bindTo($scope, "grid");
    
	$scope.me = thePlayer;
    
	$scope.startGame = function() {
		GridFactory
            .start($scope.grid._id)
            .then(function(updatedGrid){
                $state.go('game', { id: $scope.grid._id });
                $uibModalInstance.dismiss('cancel');
            })
	}; 

	$scope.leaveGame = function() {
		GridFactory.leaveGame($scope.grid._id)
		.then(function() {
			$uibModalInstance.dismiss('cancel');
		})
	};
})