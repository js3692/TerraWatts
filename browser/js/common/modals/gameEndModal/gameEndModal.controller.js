'use strict';
app.controller('GameEndModalCtrl', function($scope, players, $rootScope, $uibModalInstance, PlayGameFactory, FirebaseFactory){
  $scope.players = players;
  $rootScope.$on('$stateChangeStart', function(){
    $uibModalInstance.close();
    FirebaseFactory.deleteConnection(PlayGameFactory.getKey());
  });
  $scope.iWon = PlayGameFactory.getMe()._id === players[0]._id;

});
