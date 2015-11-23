app.config(function ($stateProvider) {
	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: 'js/signup/signup.html',
		controller: 'SignupCtrl'
	})
});

app.controller('SignupCtrl', function ($scope, AuthService, UserFactory, $state) {

	$scope.login = {};
	$scope.error = null;

	$scope.sendSignup = function(loginInfo) {
		$scope.error = null;

		UserFactory.createUser(loginInfo)
		.then(function(user) {
			if(user) return AuthService.login(loginInfo);
		})
		.then(function() {
			$state.go('login');
		}, function() {
			$scope.error = 'Try another username and/or e-mail';
		});

	};
});