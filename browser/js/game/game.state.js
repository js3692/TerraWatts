app.config(function($stateProvider){
	$stateProvider.state('game', {
		url: '/game/:id/:key',
		controller: 'GameCtrl',
		templateUrl: 'js/game/game.html',
		resolve: {
            gridId: function ($stateParams, PlayGameFactory) {
                var gridId = $stateParams.id;
                PlayGameFactory.setGridId(gridId);
                return gridId;
            },
            key: function($stateParams, PlayGameFactory) {
                var gridKey = $stateParams.key;
                PlayGameFactory.setKey(gridKey);
                return gridKey;  
            },
            theUser: function(AuthService, PlayGameFactory) {
                var user = AuthService.getLoggedInUser();
                PlayGameFactory.setUser(user);
				return user;
			}
		},
    data: {
      authenticate: true
    }
	});
});