app.directive('resourceAction', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/resourceAction/resourceAction.html',
        link: function(scope, elem, attrs){
            scope.shouldShowResourceButtons = PlayGameFactory.iAmActivePlayer;
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            
            scope.listBuyableResources = function(){
                return _.uniq(PlayGameFactory.getMyPlants()
                    .reduce((resourceList, plant) => {
                        if(plant.resourceType === 'hybrid') {
                            resourceList.push('coal');
                            resourceList.push('oil');
                        } else if(plant.resourceType !== 'green') resourceList.push(plant.resourceType);
                        return resourceList;
                    }, []), resource => resource);
            }
            
            function plantCapacityMinusBoughtResources(resourceType){
                return PlayGameFactory.getMyPlants()
                    .reduce((total, plant) => {
                        if(plant.resourceType === resourceType) {
                            total += 2*Number(plant.numResources);
                        }
                        return total;    
                    }, 0) - PlayGameFactory.getMyResources()[resourceType];
            }
            
            function hybridMax() {
                return PlayGameFactory.getMyPlants()
                    .reduce((total, plant) => {
                        if(plant.resourceType === 'hybrid') total += 2*Number(plant.numResources);
                        return total;
                    }, 0)
            }
            
            scope.getMaxBuyableFor = function(resourceType) {
                var maxWithoutHybrids = plantCapacityMinusBoughtResources(resourceType);
                if(resourceType === 'coal' || resourceType === 'oil') var hybridCapacity = hybridMax();
                
                if(resourceType === 'coal' && hybridCapacity > 0) {
                    var extraCapacity = hybridCapacity - (PlayGameFactory.getWishlist()['oil'] - plantCapacityMinusBoughtResources('oil'));
                }   
                
                if(resourceType === 'oil' && hybridCapacity > 0) {
                    var extraCapacity = hybridCapacity - (PlayGameFactory.getWishlist()['coal'] - plantCapacityMinusBoughtResources('coal'));
                }
                return maxWithoutHybrids + (extraCapacity || 0);
            };
            
            scope.buyResources = function(wishlist){
                var update = {
                    phase: 'resource',
                    player: PlayGameFactory.getMe(),
                    data: {
                        wishlist: PlayGameFactory.getWishlist()
                    }
                };
                PlayGameFactory.continue(update);
                PlayGameFactory.clearWishlist();
            };
            
            scope.pass = function(){
                var update = {
                    phase: 'resource',
                    player: PlayGameFactory.getMe(),
                    data: {
                        wishlist: {
                            oil: 0,
                            trash: 0,
                            coal: 0,
                            nuke:0
                        }
                    }
                    
                };
                PlayGameFactory.continue(update);
                PlayGameFactory.clearWishlist();
            }
        }
    }
})