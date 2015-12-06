app.directive('cityAction', function(PlayGameFactory, CityCartFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityAction/cityAction.html',
        link: function(scope, elem, attrs){
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            scope.getCart = CityCartFactory.getCart;
            scope.shouldAllowCityBuying = PlayGameFactory.iAmActivePlayer;
            scope.getCartPrice = CityCartFactory.getCartPrice.bind(null, scope.getCart());
            
            scope.buyCities = function(){
                var update = {
                    phase: 'city',
                    player: PlayGameFactory.getMe(),
                    data: {
                        citiesToAdd: CityCartFactory.getCart()
                    }
                };
                
                PlayGameFactory.continue(update);
                CityCartFactory.clearCart();
            };
            
            scope.pass = function(){
                var update = {
                    phase: 'city',
                    player: PlayGameFactory.getMe(),
                    data: {
                        citiesToAdd: []
                    }
                };
                PlayGameFactory.continue(update);
                
                CityCartFactory.clearCart();
            }
        }
    }
});