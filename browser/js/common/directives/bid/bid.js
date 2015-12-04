app.directive('bid', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bid/bid.html',
        scope: {
            buttonColor: '=',
            bid: '=ngModel'
        },
        link: function (scope, elem, attrs) {
            
            attrs.$observe('start', function(start){
                scope.bid = start;
            }); 
            
            scope.getBid = function(){
                return scope.bid;
            };
            
            scope.changeBid = function (quantity) {
                scope.bid = Number(scope.bid) + quantity;
            };
            
            scope.isMin = function(bid){
                return Number(bid) <= Number(attrs.start)
            }
        }
    }
})