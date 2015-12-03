app.directive('player', function(){
    return {
        restrict: "E",
        templateUrl: 'js/common/directives/player/player.html',
        scope: {
            player: '=',
            active: '='
        },
        link: function(scope, elem, attrs){}
    }
})