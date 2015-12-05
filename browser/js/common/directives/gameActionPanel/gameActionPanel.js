app.directive('gameActionPanel', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/gameActionPanel/gameActionPanel.html',
        link: function(scope, elem, attrs){
            scope.gamePhaseIs = function(phase){
                return PlayGameFactory.getGamePhase() === phase;
            }
            
            scope.getPlantToBidOn = PlayGameFactory.getPlantToBidOn;
            
            scope.shouldViewPlantAction = function() {
                return [
                    scope.gamePhaseIs('plant'),
                    PlayGameFactory.iAmActivePlayer() || PlayGameFactory.getAuction()
                ].every(valid => valid);
            }
            
            scope.shouldViewResourceAction = function() {
                return scope.gamePhaseIs('resource');
            }
            
            scope.shouldViewCityAction = function(){
                return scope.gamePhaseIs('city');
            }
            
            scope.shouldViewBureaucracyAction = function(){
                return scope.gamePhaseIs('bureaucracy');
            }
        }
    }
});