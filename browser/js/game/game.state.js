app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game/:id',
		controller: 'GameCtrl',
		templateUrl: 'js/game/game.html',
		resolve: {
			grid: function (GridFactory) {
				return GridFactory.getCachedGrid();
			}
		},
    data: {
      authenticate: true
    }
	});
});