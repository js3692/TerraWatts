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
            thePlayer: function(AuthService, PlayGameFactory) {
                var player = AuthService.getLoggedInUser();
                PlayGameFactory.setPlayer(player);
				return player;
			}
		},
    data: {
      authenticate: true
    }
	});
});