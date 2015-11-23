app.controller('SettingsCtrl', function ($scope, $state, $uibModalInstance, GridFactory) {
 
  $scope.ok = function () {
    GridFactory.newGame()
      .then(function (grid) {
        $uibModalInstance.close();
        $state.go('grid', { id: grid.id, key: grid.key });
      });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});