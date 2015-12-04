app.directive('resourceAction', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/resourceAction/resourceAction.html',
        link: function(scope, elem, attrs){
            scope.shouldShowResourceButtons = PlayGameFactory.iAmActivePlayer;
            scope.getActivePlayer = PlayGameFactory.getActivePlayer();
            
            scope.buyableResources = ['coal', 'oil', 'trash', 'nuke'];
            
            scope.buyResources = function(wishlist){
                var update = {
                    phase: 'resource',
                    player: PlayGameFactory.getMe(),
                    data: {
                        wishlist: PlayGameFactory.getWishlist()
                    }
                };
                PlayGameFactory.continue(update);
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
            }
        }
    }
})