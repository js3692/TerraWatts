app.directive('bottomPanel', function(SliderFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bottomPanel/bottomPanel.html',
        scope: {
           resources: '='
        },
        link: function(scope, elem, attrs){
            scope.open = SliderFactory.slideOut.bind(null, 'bottom');
            
        }
    } 
});