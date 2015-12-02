app.directive('sidePanel', function(SliderFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/sidePanel/sidePanel.html',
        scope: {
            players: '=',
            activePlayer: '='
        },
        link: function(scope, elem, attrs){
            scope.open = SliderFactory.slideOut.bind(null, 'right');
        }
    };
});