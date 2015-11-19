app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve: {
        	joinableGames: function (GridFactory) {
        		return GridFactory.getJoinableGames();
        	}
        }
    });
});

app.controller('homeCtrl', function ($scope, joinableGames, GridFactory, $state, AuthService, AUTH_EVENTS) {
	$scope.loggedIn = false;
	AuthService.getLoggedInUser()
	.then(function(user) {
		if(user) $scope.loggedIn = true;
	})
	$scope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$scope.loggedIn = false;
	})

	$scope.joinable = joinableGames;

	$scope.newGame = function() {
		console.log("in new game")
		GridFactory.newGame()
		.then(function(grid) {
			$state.go('grid', {gridId: grid._id})
		})
	}

	$scope.joinGame = function(gridId) {
		GridFactory.joinGame(gridId)
		.then(function (grid) {
			$state.go('grid', {gridId: grid._id})
		})
	}
	
})