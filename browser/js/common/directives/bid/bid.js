app.directive('bid', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bid/bid.html',
        scope: {
            start: '=',
            buttonColor: '=',
            bid: '=ngModel'
        },
        link: function (scope, elem, attrs) {
            
            //everything needs to be inside functions because the data is not populated on page load
            // bid & start are both necessary because start is bound to the plant rank (used one-way data binding);
            scope.getBid = function(){
                scope.bid = scope.start;
                return scope.start;
            }
            
            scope.changeBid = function (quantity) {
                scope.start += quantity;
                scope.bid = scope.start;
            }
        }
    }
})