app.directive('cityBuyPanel', function (PlayGameFactory) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/cityBuy/cityBuy.html',
        scope: {
            citiesToBuy: '=',
            player: '='
        },
        link: function (scope, elem, attrs) {
        	scope.sendCities = function() {
 	       	console.log(scope.citiesToBuy)
        		var update = {
        			player: scope.player,
        			phase: 'city',
        			data: {
        				citiesToAdd: scope.citiesToBuy
        			}
        		}
        		PlayGameFactory.continue(update);
        	}
        }
    }
})