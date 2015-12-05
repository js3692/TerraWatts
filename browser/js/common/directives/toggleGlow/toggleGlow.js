app.directive("toggleGlow", function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.bind('click', function(){
                elem.find('img').toggleClass("picked-plant");  
            });
        }
    };
});