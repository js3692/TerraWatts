app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
          joinableGamesFromServer: function (GridFactory) {
            return GridFactory.getJoinableGames();
          }
        },
        data: {
          authenticate: true
        }
    });
});

app.controller('HomeCtrl', function ($scope, joinableGamesFromServer, GridFactory, $state, AuthService, AUTH_EVENTS, $uibModal, FirebaseFactory) {
    
  /* populates joinable game from backend, then uses live updates from firebase */
  $scope.games = FirebaseFactory.getBase();
  $scope.joinableGamesFromServer = joinableGamesFromServer;
	$scope.getLiveJoinableGames = FirebaseFactory.getLiveJoinableGames.bind(null, $scope);
	
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $state.go('login');
    });
  };

	$scope.newGame = openGameSettings;

	$scope.joinGame = function (grid) {
		GridFactory.joinGame(grid.id)
      .then(function () {
        $state.go('grid', { id: grid.id, key: grid.key });
      });
	};

  function openGameSettings() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'js/settings/settings.html',
      controller: 'SettingsCtrl',
      windowClass: 'settings-modal',
      size: 'md'
    });
  }
                                         
});