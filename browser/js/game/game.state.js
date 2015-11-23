app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game/:id/:key',
		controller: 'GameCtrl',
		templateUrl: 'js/game/game.html',
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