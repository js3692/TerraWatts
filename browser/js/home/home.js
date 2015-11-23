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

app.controller('HomeCtrl', function ($scope, joinableGamesFromServer, GridFactory, $state, AuthService, $uibModal, FirebaseFactory, $firebaseObject) {

  var allGamesRef = FirebaseFactory.getBase();
  $scope.games = $firebaseObject(allGamesRef);

  $scope.joinableGamesFromServer = joinableGamesFromServer;
  $scope.getLiveJoinableGames = FirebaseFactory.getLiveJoinableGames.bind(null, $scope);
   
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $state.go('login');
    });
  };

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