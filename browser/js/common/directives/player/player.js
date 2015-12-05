app.directive('player', function(PlayGameFactory){
    return {
        restrict: "E",
        templateUrl: 'js/common/directives/player/player.html',
        scope: {
            player: '='
        },
        link: function(scope, elem, attrs){
            scope.isActive = function(){
                return [
                        PlayGameFactory.getActivePlayer()._id === scope.player._id,
                        PlayGameFactory.getGamePhase() !== 'bureaucracy'
                    ].every(valid => valid);
            }

        }
    }
})