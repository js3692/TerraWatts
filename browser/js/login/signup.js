app.config(function ($stateProvider) {

	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: 'js/login/signup.html',
		controller: 'SignupCtrl'
	})
})

app.controller('SignupCtrl', function ($scope, AuthService, UserFactory, $state) {

	$scope.login = {};
	$scope.error = null;

	$scope.sendSignup = function(loginInfo) {
		$scope.error = null;

		UserFactory.createUser(loginInfo)
		.then(function(user) {
			if(user) return AuthService.login(loginInfo)
		})
		.then(function() {
			$state.go('home');
		}).catch(function(err) {
			console.log(err)
			$scope.error = 'Invalid login credentials.'
		});

	};
});