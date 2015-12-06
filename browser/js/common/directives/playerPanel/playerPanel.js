app.directive('playerPanel', function(SliderFactory, PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/playerPanel/playerPanel.html',
        link: function(scope, elem, attrs){
            
            scope.view = 'players';
            
            scope.getTurnOrder = PlayGameFactory.getTurnOrder;
            scope.open = SliderFactory.slideOut.bind(null, 'right');
            scope.toggleArrows = scope.toggleArrows = SliderFactory.toggleSliderArrowsHandler('left');
        }
    };
});