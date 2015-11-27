app.directive('plantPanel', function(SliderFactory){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/plantPanel/plantPanel.html",
        scope: {
            plantMarket: '='
        },
        link: function(scope, elem, attrs){   
          scope.open = SliderFactory.slideOut.bind(null, 'plant');
        }
    }
})