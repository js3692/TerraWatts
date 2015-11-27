app.directive('bottomPanel', function(SliderFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bottomPanel/bottomPanel.html',
        scope: {
           resources: '='
        },
        link: function(scope, elem, attrs){
            scope.open = SliderFactory.slideOut.bind(null, 'bottom');
            scope.resourceSpecs = {
                coal: { color: "brown", max: 24 },
                nuke: { color: "red", max: 12 },
                oil: { color: "black", max: 24 },
                trash: { color: "yellow", max: 24 }
            };
        }
    } 
});