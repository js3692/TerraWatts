
app.controller('GameCtrl', function($scope){
    // $scope.grid = gridConnection;
    $scope.gameData = [
    	{name: 'city1', x: 200, y: 200, slot10: null, slot15: null, slot20: null},
    	{name: 'city2', x: 400, y: 400, slot10: 'player1', slot15: null, slot20: null},
    	{name: 'city3', x: 600, y: 600, slot10: 'player2', slot15: 'player1', slot20: null},
    	{name: 'city4', x: 800, y: 800, slot10: 'player3', slot15: 'player2', slot20: 'player1'}
    ];


});