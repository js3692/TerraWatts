app.directive('gameActionPanel', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/gameActionPanel/gameActionPanel.html',
        link: function(scope, elem, attrs){
            
            scope.getGamePhase = PlayGameFactory.getGamePhase;
            scope.gamePhaseIs = function(phase){
                return PlayGameFactory.getGamePhase() === phase;
            }
            scope.getPlantToBidOn = PlayGameFactory.getPlantToBidOn;
        }
    }
});