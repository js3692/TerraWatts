app.directive('bureaucracyAction', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bureaucracyAction/bureaucracyAction.html',
        link: function(scope, elem, attrs){
            
            scope.plantCart = [];
            
            scope.getMyPlants = PlayGameFactory.getMyPlants;
            
            scope.togglePlant = function(plant) {
                var plantIdx = scope.plantCart.indexOf(plant);
                if(~plantIdx) scope.plantCart.splice(plantIdx, 1); 
                else scope.plantCart.push(plant);
            }
            
            scope.powerPlants = function(){
                var update = {
                    player: PlayGameFactory.getMe(),
                    phase: 'bureaucracy',
                    data: {
                        plantsToPower: scope.plantCart
                    } 
                }
                PlayGameFactory.continue(update);
            } 
            
            scope.powerNone = function(){
                var update = {
                    player: PlayGameFactory.getMe(),
                    phase: 'bureaucracy',
                    data: {
                        plantsToPower: []    
                    } 
                };
                
                PlayGameFactory.continue(update);
            }
            
            scope.getNumberOfCitiesPowered = function(){
                var capacity = scope.getMyPlants()
                    .reduce((total, plant) => {
                        return total += plant.capacity;
                    }, 0);
                return Math.min(capacity, PlayGameFactory.getMyCities().length);
                
            }
            
            var profitsArray = [10,22,33,44,54,64,73,82,90,98,105,112,118,124,129,134,138,142,145,148,150]; 
            
            scope.calculateProfits = function() {
                return profitsArray[scope.getNumberOfCitiesPowered()];
            }
        }
    }
})