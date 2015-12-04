app.directive('plantToAction', function(SliderFactory, PlayGameFactory, $rootScope){
    return {
        restrict: 'A',
        scope: {
            plant: '='
        },
        link: function(scope, elem, attrs){
            elem.bind('click', function(event){
                PlayGameFactory.setPlantToBidOn(scope.plant);
                $rootScope.$digest();
            });
        }
    }
})