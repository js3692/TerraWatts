app.directive('plantDiscardAction', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/plantDiscardAction/plantDiscardAction.html',
        link: function(scope, elem, attrs){
            scope.getMyPlants = PlayGameFactory.getMyPlants;
            var plantToDiscard;
            
            scope.isPlantToDiscard = function(plant){
                return plant === plantToDiscard;
            }
            
            scope.setAsPlantToDiscard = function(plant){
                plantToDiscard = plant;
            }
            
            scope.unsetAsPlantToDiscard = function(plant){
                plantToDiscard = null;
            }
            
            scope.choosePlantToDiscard = function(){
                var update = {}
                PlayGameFactory.continue(update);
            }
        }
    }
})