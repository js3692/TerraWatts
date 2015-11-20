app.controller('GameCtrl', function($scope, $firebaseObject){
    console.log('inside game controller, ');
    var ref = new Firebase("https://amber-torch-6713.firebaseio.com/");
    $scope.data = {};
    // download the data into a local object
      var syncObject = $firebaseObject(ref);
      // synchronize the object with a three-way data binding
      // click on `index.html` above to see it used in the DOM!
      syncObject.$bindTo($scope, "data");
});