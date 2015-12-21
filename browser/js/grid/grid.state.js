app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id/:key',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			gridId: function ($stateParams) {
      	return $stateParams.id;
      },
			key: function($stateParams) {
				return $stateParams.key;  
			},
			regions: function ($stateParams, BeforeGameFactory) {
				return BeforeGameFactory.getRegions($stateParams.id);
			},
			theUser: function(AuthService) {
				var user = AuthService.getLoggedInUser();
				user.color = null;
				return user;
			}
		},
    data: {
      authenticate: true
    }
	});
});