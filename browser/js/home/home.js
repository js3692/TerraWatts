app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
        	joinableGames: function (GridFactory) {
        		return GridFactory.getJoinableGames();
        	}
        }
    });
});

app.controller('HomeCtrl', function ($scope, joinableGames, GridFactory, $state, AuthService, AUTH_EVENTS, $uibModal) {
	
    $scope.loggedIn = false;
	
    AuthService.getLoggedInUser()
	.then(function(user) {
		if(user) $scope.loggedIn = true;
	})
    
	$scope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$scope.loggedIn = false;
	})

	$scope.joinableGames = joinableGames;

	$scope.newGame = function() {
		GridFactory.newGame()
		.then(openModal)
	}

	$scope.joinGame = function(gridId) {
		GridFactory.joinGame(gridId)
		.then(openModal)
	}
    
    function openModal() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'js/grid/grid.html',
            controller: 'GridCtrl',
            size: 'sm',
            resolve: {
                thePlayer: function(AuthService) {
                    return AuthService.getLoggedInUser();
                },
                firebaseConnection: function(FirebaseFactory){
                    return FirebaseFactory.getConnection();
                }
            }
        });
    }
})