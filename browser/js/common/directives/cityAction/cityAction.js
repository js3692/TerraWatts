app.directive('cityAction', function(PlayGameFactory, CityCartFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityAction/cityAction.html',
        link: function(scope, elem, attrs){
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            scope.getCart = CityCartFactory.getCart;
            scope.shouldAllowCityBuying = PlayGameFactory.iAmActivePlayer;
            scope.getCartPrice = function(){
                return CityCartFactory.getCartPrice(scope.getCart());
            }
            
            scope.buyCities = function(){};
            scope.pass = function(){}
        }
    }
})