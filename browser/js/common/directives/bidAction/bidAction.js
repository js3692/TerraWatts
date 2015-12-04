app.directive('bidAction', function(){ 
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/bidAction/bidAction.html',
        scope: {
            plant: '='   
        }
    }
});