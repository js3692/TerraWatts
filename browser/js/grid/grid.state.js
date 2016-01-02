app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id/:key',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		params: {
			selectedMap: null
		},
		resolve: {
			gridId: function ($stateParams) {
      	return $stateParams.id;
      },
			key: function ($stateParams) {
				return $stateParams.key;  
			},
			selectedMap: function ($stateParams) {
				return $stateParams.selectedMap;
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