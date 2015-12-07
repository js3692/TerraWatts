app.controller('GridCtrl', function ($scope, $state, BeforeGameFactory, FirebaseFactory, AppConstants, theUser, gridId, key) {
  $scope.grid = FirebaseFactory.getConnection(key);
  FirebaseFactory.getConnection(key).$loaded()
    .then(function (grid) {
      var emptySlots = grid.maxPlayers - grid.players.length;
      $scope.players = grid.players.concat(_.fill(Array(emptySlots), null));
    })
  $scope.key = key;
  $scope.me = theUser;

  $scope.selected = theUser.color;
  $scope.colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
  $scope.changeColor = BeforeGameFactory.changeColor.bind(null, gridId, theUser._id)
  $scope.colorPicked = function(color){
    var players = $scope.grid.players;

    if(!players) return false;

    for(let i = 0, len = players.length; i < len; i++){
      if(color === players[i].color) return .4;
    }

    return false;
  };

    
  $scope.$watch('grid.game', function(game){
      if(game) $state.go('game', { id: gridId, key: key });
  });
    
	$scope.startGame = function() {
		BeforeGameFactory.start($scope.grid.id, $scope.grid.players);
	};

	$scope.leaveGame = function() {
    angular.element("#grid")
      .addClass("fadeOutRightBig")
      .one(AppConstants.animationEndEvent, function () {
        BeforeGameFactory
          .leaveGame($scope.grid.id)
          .then(function() {
            $state.go('home');
          });
      });
	};
});