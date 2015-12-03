app.directive('gameActionPanel', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/gameActionPanel/gameActionPanel.html',
        link: function(scope, elem, attrs){
            scope.getPlantToBidOn = PlayGameFactory.getPlantToBidOn;
        }
    }
});