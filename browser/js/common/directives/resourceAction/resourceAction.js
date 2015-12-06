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
                        } else resourceList.push(plant.resourceType);
                        return resourceList;
                    }, []), resource => resource);
            }
            
            scope.getMaxBuyableFor = function(resourceType) {
                
                
                return PlayGameFactory.getMyPlants()
                    .reduce((total, plant) => {
                        if(plant.resourceType === resourceType) {
                            total += 2*Number(plant.numResources);
                        }
                        if(plant.resourceType === 'hybrid') {
                            if(resourceType === 'coal' || resourceType === 'oil') {
                                total += 2*Number(plant.numResources);
                            }
                        }
                        return total;    
                    }, 0) - PlayGameFactory.getMyResources()[resourceType];
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