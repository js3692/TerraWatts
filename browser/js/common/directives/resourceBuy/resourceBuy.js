app.directive('resourceBuy', function(){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/resourceBuy/resourceBuy.html",
        scope: {
            resources: '=',
            wishlist: '=ngModel'
        },
        link: function(scope, elem, attrs){
            scope.wishlist = {
                coal: 0,
                oil: 0,
                trash: 0,
                nuke: 0
            };
            
            scope.changeWish = function(item, amount) {
                scope.wishlist[item] += amount;
            }
            
            scope.isMin = function(value){
                return value > 0;
            }
            
        }
    }
})