app.directive('commandCenter', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/commandCenter/commandCenter.html',
        scope: true,
        link: function(scope, elem, attrs){
            
            scope.getGamePhase = function() {
                var phase = PlayGameFactory.getGamePhase();
                if(phase === 'plantDiscard') return 'auction';
                return phase;
            }
            
            scope.getWaitingOnPlayer = PlayGameFactory.getWaitingOnPlayer;
            scope.getTurn = PlayGameFactory.getTurn;
            scope.getStep = PlayGameFactory.getStep;
        }
    }
});