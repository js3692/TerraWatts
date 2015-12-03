app.directive('plant', function(){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/plant/plant.html",
        link: function(scope, elem, attrs){
            scope.rank = attrs.rank;
        }
    }
}); 