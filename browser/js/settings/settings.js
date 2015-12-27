app.controller('SettingsCtrl', function ($scope, $state, $uibModalInstance, AppConstants, BeforeGameFactory) {

  $scope.gameSettings = {};
  $scope.gameSettings.map = 'United States';
  $scope.gameSettings.numPlayers = 2;
  $scope.gameSettings.color = 'purple';

  $scope.countries = [
    { name: 'United States', code: 'us' },
    { name: 'Germany', code: 'de' },
    { name: 'China', code: 'cn' },
    { name: 'South Korea', code: 'kr'}
  ];
  $scope.numPlayersChoices = [2, 3, 4, 5, 6];
  $scope.colorChoices = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
  $scope.dropdownColor = {
    purple: "#6600cc",
    yellow: "#ffd700",
    green: "#009933",
    blue: "#0066cc",
    red: "#cc0000",
    black: "#191919"
  };

  $scope.flag = function (country) {
    var spanClass;
    $scope.countries.forEach(function (elem) {
      if (elem.name === country) spanClass = "flag-icon flag-icon-" + elem.code;
    });
    return spanClass;
  };

  $scope.selectMap = function (country) {
    $scope.gameSettings.map = country;
  };

  $scope.selectNumPlayers = function (number) {
    $scope.gameSettings.numPlayers = number;
  };

  $scope.selectColor = function (color) {
    $scope.gameSettings.color = color;
  };

  $scope.ok = function (gameSettings) {
    $uibModalInstance.close();
    angular.element("#home")
      .addClass("fadeOutLeftBig")
      .one(AppConstants.animationEndEvent, function () {
        if(!gameSettings.makeRandom) gameSettings.makeRandom = false;
        BeforeGameFactory.newGame(gameSettings)
          .then(function (grid) {
            $state.go('grid', { id: grid._id, key: grid.key, randomRegionsSelected: $scope.gameSettings.makeRandom });
          });
      });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});