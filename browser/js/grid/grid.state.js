app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			theGrid: function ($stateParams, GridFactory) {
                var grid = GridFactory.getCachedGrid($stateParams.id);
                $stateParams.id = grid._id;
                return grid;
			},
			thePlayer: function(AuthService) {
				return AuthService.getLoggedInUser();
			}
		}
	})
})