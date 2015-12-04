app.directive('cityAction', function(PlayGameFactory, CityCartFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityAction/cityAction.html',
        link: function(scope, elem, attrs){
            scope.getActivePlayer = PlayGameFactory.getActivePlayer;
            scope.getCitiesInCart = CityCartFactory.getCart;
            scope.shouldAllowCityBuying = PlayGameFactory.iAmActivePlayer;
            
            scope.buyCities = function(){};
            scope.pass = function(){}
        }
    }
})