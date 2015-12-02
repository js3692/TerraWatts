app.directive('cityBuyPanel', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityBuy/cityBuy.html',
        scope: {
            data: '='
        },
        link: function (scope, elem, attrs) {

        }
    }
})