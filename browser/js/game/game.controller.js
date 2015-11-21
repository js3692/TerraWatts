app.controller('GameCtrl', function($scope, grid, $firebaseObject){
    var ref = new Firebase("https://amber-torch-6713.firebaseio.com/" + grid.key);
    $scope.data = {};
    // download the data into a local object
    var syncObject = $firebaseObject(ref);
      
    syncObject.$bindTo($scope, "data");
});