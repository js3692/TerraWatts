app.directive('plantToAction', function(SliderFactory, PlayGameFactory){
    return {
        restrict: 'A',
        scope: {
            plant: '='
        },
        link: function(scope, elem, attrs){
            elem.bind('click', function(event){
                if(!elem.hasClass('make-invisible')) {
                    SliderFactory.plantToAction(elem);   
                    PlayGameFactory.setPlantToBidOn(scope.plant);
                };
            });
        }
    }
})