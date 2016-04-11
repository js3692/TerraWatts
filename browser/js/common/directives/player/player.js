app.directive('player', function (PlayGameFactory) {
  return {
    restrict: "E",
    templateUrl: 'js/common/directives/player/player.html',
    scope: {
      player: '='
    },
    link: function (scope) {
      scope.isActive = function () {
        return [
          PlayGameFactory.getActivePlayer()._id === scope.player._id,
          !PlayGameFactory.gameIsComplete()
        ].every(valid => valid);
      }

    }
  }
});
