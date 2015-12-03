app.directive('bid', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bid/bid.html',
        scope: {
            start: '=',
            buttonColor: '=',
            bid: '=ngModel' //what's this? - G&N
        },
        link: function (scope, elem, attrs) {
            scope.bid = scope.start;
            scope.changeBid = function (quantity) {
                scope.bid += quantity;
            }

            scope.isMin = function (bid) {
                return bid <= scope.start;
            }
        }
    }
})