app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
          joinableGames: function (GridFactory) {
            return GridFactory.getJoinableGames();
          }
        },
        data: {
          authenticate: true
        }
    });
});

app.controller('HomeCtrl', function ($scope, joinableGames, GridFactory, $state, AuthService, AUTH_EVENTS, $uibModal) {
	
  $scope.loggedIn = false;
	
  AuthService.getLoggedInUser()
    .then(function(user) {
      if(user) $scope.loggedIn = true;
    });

	$scope.$on(AUTH_EVENTS.logoutSuccess, function() {
		$scope.loggedIn = false;
	});

  $scope.logout = function () {
    AuthService.logout().then(function () {
      $state.go('login');
    });
  };

	$scope.joinableGames = joinableGames;

	$scope.newGame = openGameSettings;

	$scope.joinGame = function (gridId) {
		GridFactory.joinGame(gridId)
      .then(function () {
        $state.go('grid', { id: gridId });
      });
	};

  function openGameSettings() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'js/settings/settings.html',
      controller: 'SettingsCtrl',
      size: 'lg'
    });
  }
});