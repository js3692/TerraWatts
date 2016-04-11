app.config(function($stateProvider) {
    $stateProvider.state('tour', {
        url: '/tour',
        controller: 'TourCtrl',
        templateUrl: 'js/game/game.html',
        resolve: {
            grid: function(TourFactory) {
                return TourFactory.initGrid();
            }
        }
    });
});

app.controller('TourCtrl', function($scope, $rootScope, $timeout, grid, PlayGameFactory, CityCartFactory, TourFactory) {
    $scope.grid = grid;
    PlayGameFactory.setGrid(grid);
    $scope.cityCart = CityCartFactory.getCart;
    $scope.showCityBuyPanel = false;
    $scope.hideGameAction = function(){
        if(PlayGameFactory.getAuction()) return false;
        return Boolean(PlayGameFactory.getWaitingOnPlayer());
    }
    $scope.me = function() {
        return $scope.grid.players[0].user;
    }

    $scope.tour = TourFactory.getTour($rootScope, $scope);
    function startTour() {
        $scope.tour.init(true);
        $scope.tour.start(true);
        $scope.tour.goTo(0);
    }

    $timeout(startTour)

});
