app.directive('resourceBuyer', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/resourceBuyer/resourceBuyer.html",
        scope: {
            resourceType: '=',
            max: '='
        },
        link: function(scope, elem, attrs){
            scope.isMin = function(){
                return scope.getBid() <= 0;
            };
            
            scope.isMax = function(){
                return scope.getBid() >= +scope.max;
            }
            
            scope.changeBid = function (quantity){
                PlayGameFactory.changeWishlist(scope.resourceType, quantity);  
            };
            
            scope.getBid = function(){
                return PlayGameFactory.getWishlist()[scope.resourceType];
            }
            
        }
    }
});