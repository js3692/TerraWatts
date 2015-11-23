app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id/:key',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			gridConnection: function ($stateParams, FirebaseFactory) {
                return FirebaseFactory.getConnection($stateParams.key);
			},
			thePlayer: function(AuthService) {
				return AuthService.getLoggedInUser();
			}
		},
    data: {
      authenticate: true
    }
	});
});