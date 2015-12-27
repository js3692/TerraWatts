app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id/:key',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			gridId: function ($stateParams) {
      	return $stateParams.id;
      },
			key: function ($stateParams) {
				return $stateParams.key;  
			},
			theUser: function (AuthService) {
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