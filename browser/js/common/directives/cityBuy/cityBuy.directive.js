// app.directive('cityBuyPanel', function (PlayGameFactory, CityCart) {
//     return {
//         restrict: 'E',
//         templateUrl: 'js/common/directives/cityBuy/cityBuy.html',
//         scope: {
//             citiesToBuy: '=',
//             player: '='
//         },
//         link: function (scope, elem, attrs) {
//         	scope.sendCities = function() {
//         		var update = {
//         			player: scope.player,
//         			phase: 'city',
//         			data: {
//         				citiesToAdd: CityCart
//         			}
//         		}
//         		PlayGameFactory.continue(update);
//         	}
//         }
//     }
// })
