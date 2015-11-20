app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:gridId',
		controller: 'gridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			theGrid: function ($stateParams, GridFactory) {
				return GridFactory.fetchOne($stateParams.gridId);
			},
			thePlayer: function(AuthService) {
				return AuthService.getLoggedInUser();
			}
		}
	})
})

app.controller('gridCtrl', function ($scope, theGrid, thePlayer, GridFactory) {
    console.log('theGrid', theGrid);
	$scope.grid = theGrid;
	$scope.me = thePlayer;
	$scope.startGame = function() {
        
		GridFactory.start($scope.grid._id)
	}
})