app.directive('cityAction', function(PlayGameFactory, CityCartFactory, $state, $rootScope){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityAction/cityAction.html',
        link: function(scope, elem, attrs){
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            scope.getCart = CityCartFactory.getCart;
            scope.shouldAllowCityBuying = PlayGameFactory.iAmActivePlayer;
            scope.getCartPrice = CityCartFactory.getCartPrice.bind(null, scope.getCart());

            scope.notEnoughMoney = function(){
                return scope.getCartPrice() > PlayGameFactory.getMe().money;
            }

            scope.buyCities = function(){
                if($state.is('tour')) {
                    $rootScope.$broadcast('cityBuy', scope.getCart(), scope.getCartPrice());
                } else {
                    var update = {
                        phase: 'city',
                        player: PlayGameFactory.getMe(),
                        data: {
                            citiesToAdd: CityCartFactory.getCart()
                        }
                    };
                }

                PlayGameFactory.continue(update)
                    .then(CityCartFactory.clearCart);
            };

            scope.pass = function(){
                var update = {
                    phase: 'city',
                    player: PlayGameFactory.getMe(),
                    data: {
                        citiesToAdd: []
                    }
                };
                PlayGameFactory.continue(update)
                    .then(CityCartFactory.clearCart);
            }
        }
    }
});
