app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl',
        resolve: {
          userDoesExist: function (AuthService) {
            return AuthService.getLoggedInUser();
          }
        }
    });

});

app.controller('LoginCtrl', function ($scope, userDoesExist, AuthService, $state, AUTH_EVENTS, AppConstants) {

    $scope.loggedIn = false;

    if(userDoesExist) {
      $scope.loggedIn = true;
      $scope.username = userDoesExist.username;
    }

    $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
      $scope.loggedIn = false;
    });

    $scope.continue = function () {
      $state.go('home');
    };

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
      $scope.error = null;
      AuthService.login(loginInfo).then(function () {
        angular.element("#login-main")
          .addClass("fadeOut")
          .one(AppConstants.animationEndEvent, function () {
            $state.go('home');
          })
      }).catch(function () {
        $scope.error = 'Invalid login credentials.';
      });
    };

    $scope.signup = function () {
      angular.element("#login-main")
        .addClass("fadeOut")
        .one(AppConstants.animationEndEvent, function () {
          $state.go('signup');
        })
    }

});