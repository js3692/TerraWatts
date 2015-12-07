app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        templateUrl: 'js/profile/profile.html',
        data: {
          authenticate: true
        }
    });

});

app.controller('ProfileController', function ($scope, Session) {
	$scope.user = Session.user;
});