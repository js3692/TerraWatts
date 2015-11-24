app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game/:id/:key',
		controller: 'GameCtrl',
		templateUrl: 'js/game/game.html',
		resolve: {
            gridId: function ($stateParams) {
                return $stateParams.id;
            },
            key: function($stateParams) {
                return $stateParams.key;  
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