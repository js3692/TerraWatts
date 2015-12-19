app.controller('GridCtrl', function ($scope, $state, $q, BeforeGameFactory, FirebaseFactory, RegionSelectorFactory, AppConstants, theUser, gridId, key) {
  $scope.grid = FirebaseFactory.getConnection(key);

  var waiting = _.fill(Array(5), {
    color: '#808080',
    user: {
      username: 'Waiting...'
    }
  });

  $scope.selectedRegions = [];
  function selector (regionNumber) {
    $scope.selectedRegions.push(regionNumber + 1);
  }

  $scope.$watch('grid.randomRegions', function (randomRegions) {
    $scope.randomRegionsSelected = randomRegions;
  });

  RegionSelectorFactory.draw(selector);

  $scope.$watch('grid.players', function (players) {
    if(players !== undefined && players.length) {
      var emptySlots = $scope.grid.maxPlayers - players.length;
      $scope.players = players.concat(waiting.slice(0, emptySlots));
      $scope.owner = players[0].user.username === theUser.username;
    }
  }, true);
  $scope.key = key;
  $scope.me = theUser;

  $scope.countries = [
    { name: 'United States', code: 'us' },
    { name: 'Germany', code: 'de' },
    { name: 'China', code: 'cn' },
    { name: 'South Korea', code: 'kr'}
  ];

  $scope.flag = function (country) {
    var spanClass;
    $scope.countries.forEach(function (elem) {
      if (elem.name === country) spanClass = "flag-icon flag-icon-" + elem.code;
    });
    return spanClass;
  };

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
		BeforeGameFactory.start($scope.grid.id, $scope.selectedRegions);
	};

  $scope.goHome = function() {
    $state.go('home');
  }

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