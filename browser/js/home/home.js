app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        data: {
          authenticate: true
        },
        resolve: {
          fromState: function ($state) {
            return $state.current.name;
          }
        }
    });
});

app.controller('HomeCtrl', function ($scope, $state, $uibModal, AuthService, Session, AppConstants, fromState, BeforeGameFactory, FirebaseFactory) {
  if(fromState === "login" || fromState === "signup") angular.element("#home").addClass("fadeIn");
  else if (fromState === "grid") angular.element("#home").addClass("fadeInLeftBig");

  /* populates joinable game from backend, then uses live updates from firebase */
  $scope.games = FirebaseFactory.getBase();
  $scope.getLiveJoinableGames = FirebaseFactory.getLiveJoinableGames.bind(null, $scope);

  $scope.me = Session.user.username;


  $scope.currentlyInGame = function (liveGame) {
    return liveGame.players.some(function (player) {
      if(player.user.id === Session.user.id) return true;
    });
  };

  $scope.logout = function () {
    AuthService.logout().then(function () {
      angular.element("#home")
        .addClass("fadeOut")
        .one(AppConstants.animationEndEvent, function () {
          $state.go('login');
        })
    });
  };

	$scope.joinGame = function (grid) {
    BeforeGameFactory.joinGame(grid.id)
      .then(function () {
        angular.element("#home")
          .addClass("fadeOutLeftBig")
          .one(AppConstants.animationEndEvent, function () {
            $state.go('grid', { id: grid.id, key: grid.key });
          })
      });
	};

  $scope.goBackIn = function (grid) {
    angular.element("#home")
      .addClass("fadeOutLeftBig")
      .one(AppConstants.animationEndEvent, function () {
        $state.go('grid', { id: grid.id, key: grid.key });
      });
  };

  $scope.openProfile = function () {
    console.log('whatwhat')
  };

  function openGameSettings() {
    angular.element("#home").css("-webkit-animation-delay", "0.5s");
    angular.element("#home").css("-moz-animation-delay", "0.5s");
    angular.element("#home").css("-ms-animation-delay", "0.5s");
    $uibModal.open({
      animation: true,
      templateUrl: 'js/settings/settings.html',
      controller: 'SettingsCtrl',
      windowClass: 'settings-modal',
      size: 'md'
    });
  }

  $scope.newGame = openGameSettings;
                                         
});