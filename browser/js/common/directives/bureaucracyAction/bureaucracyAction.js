app.directive('bureaucracyAction', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bureaucracyAction/bureaucracyAction.html',
        link: function(scope, elem, attrs){
            scope.madeChoice = false;
            scope.hybridChoice = false;
            
            
            scope.plantCart = [];
            
            scope.notEnoughResources = function(){
                var myResources = _.cloneDeep(PlayGameFactory.getMyResources());
                for(var i = 0; i < scope.plantCart.length; i++) {
                    var plantResourceType = scope.plantCart[i].resourceType;
                    myResources[plantResourceType] -= scope.plantCart[i].numResources;  
                    if(myResources[plantResourceType] < 0) return true;
                }
                return false;
            }
            
            scope.getMyPlants = PlayGameFactory.getMyPlants;
            
            scope.togglePlant = function(plant) {
                var plantIdx = scope.plantCart.indexOf(plant);
                if(~plantIdx) scope.plantCart.splice(plantIdx, 1); 
                else scope.plantCart.push(plant);
            }
            
            scope.submitHybridChoice = function(){
                var update = {
                    player: PlayGameFactory.getMe(),
                    phase: 'bureaucracy',
                    data: {
                        plantsToPower: scope.plantCart,
                    },
                    choice: {
                        resourcesToUseForHybrids: PlayGameFactory.getResourcesToUseForHybrids()
                    }
                };
                PlayGameFactory.continue(update);
                PlayGameFactory.clearResourcesToUseForHybrids();
                scope.madeChoice = true;
            }
            
            scope.powerPlants = function(){
                if(showHybridChoice()){
                    scope.hybridChoice = true;
                } else {  
                    var update = {
                        player: PlayGameFactory.getMe(),
                        phase: 'bureaucracy',
                        data: {
                            plantsToPower: scope.plantCart
                        } 
                    }
                    PlayGameFactory.continue(update);
                    scope.madeChoice = true;
                }
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
                scope.madeChoice = true;
            }
            
            scope.nonePowered = function(){
                return scope.plantCart.length === 0;
            }
            
            function iHaveBothOilAndCoal() {
                var myResources = PlayGameFactory.getMyResources();
                return myResources['oil'] > 0 && myResources['oil'] > 0; 
            }
            
            
            function showHybridChoice() {
                if(!iHaveBothOilAndCoal()) return false;
                for(var i = 0; i < scope.plantCart.length; i++){
                    if(scope.plantCart[i].resourceType === 'hybrid') return true;    
                }
                return false;
            };
            
            
            scope.getNumberOfCitiesPowered = function(){
                var capacity = scope.plantCart
                    .reduce((total, plant) => {
                        return total += plant.capacity;
                    }, 0);
                return Math.min(capacity, (PlayGameFactory.getMyCities() ? PlayGameFactory.getMyCities().length : 0)); 
            }
            
            var profitsArray = [10,22,33,44,54,64,73,82,90,98,105,112,118,124,129,134,138,142,145,148,150]; 
            
            scope.calculateProfits = function() {
                return profitsArray[scope.getNumberOfCitiesPowered()];
            }
        }
    }
})