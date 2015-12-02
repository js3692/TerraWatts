app.directive('sidePanel', function(SliderFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/sidePanel/sidePanel.html',
        scope: {
            players: '=',
            activePlayer: '=',
            turnOrder: '='
        },
        link: function(scope, elem, attrs){
            
            //match players to turn order.
//            scope.getTurnOrder = function() {
//                if(scope.turnOrder && scope.players){
//                    return scope.turnOrder.map(function(turn){
//                        for(var i = 0; i < scope.players.length; i++){
//                            if(scope.players[i]._id === turn) return scope.players[i];
//                        }
//                    });   
//                }
//            }
            
            scope.open = SliderFactory.slideOut.bind(null, 'right');
        }
    };
});