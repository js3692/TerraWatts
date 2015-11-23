app.controller('SettingsCtrl', function ($scope, $state, $uibModalInstance, GridFactory) {
  $scope.ok = function () {
    GridFactory.newGame()
      .then(function () {
        $uibModalInstance.close();
        $state.go('grid');
      });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});