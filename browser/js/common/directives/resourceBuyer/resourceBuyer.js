app.directive('resourceBuyer', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/resourceBuyer/resourceBuyer.html",
        scope: {
            resourceType: '='
        },
        link: function(scope, elem, attrs){
            scope.isMin = function(bid){
                return scope.getBid() <= 0;
            };
            
            scope.changeBid = function (quantity){
                PlayGameFactory.changeWishlist(scope.resourceType, quantity);  
            };
            
            scope.getBid = function(){
                return PlayGameFactory.getWishlist()[scope.resourceType];
            }
            
        }
    }
});