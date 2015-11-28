app.directive('resource', function(){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/resource/resource.html",
        scope: {
            resource:'=',
            quantity:'='
        },
        link: function(scope, elem, attrs){ 
            

        }
    }
}); 