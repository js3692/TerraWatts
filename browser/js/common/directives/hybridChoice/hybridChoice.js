app.directive('hybridChoice', function(PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/hybridChoice/hybridChoice.html",
        scope: {
            resourceType: '='
        },
        link: function(scope, elem, attrs){
            scope.isMin = function(){
                return scope.getBid() <= 0;
            };
            
//            scope.isMax = function(){
//                return scope.getBid() >= +scope.max;
//            }
            
            scope.changeBid = function (quantity){
                PlayGameFactory.changeResourcesToUseForHybrids(scope.resourceType, quantity);  
            };
            
            scope.getBid = function(){
                return PlayGameFactory.getResourcesToUseForHybrids()[scope.resourceType];
            }
        }
    }
})
