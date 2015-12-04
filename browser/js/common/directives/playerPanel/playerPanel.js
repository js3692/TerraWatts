app.directive('playerPanel', function(SliderFactory, PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/playerPanel/playerPanel.html',
        link: function(scope, elem, attrs){
            scope.getTurnOrder = PlayGameFactory.getTurnOrder;
            scope.open = SliderFactory.slideOut.bind(null, 'right');
        }
    };
});