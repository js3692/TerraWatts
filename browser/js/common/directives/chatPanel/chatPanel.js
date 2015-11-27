app.directive('chatPanel', function(SliderFactory){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/chatPanel/chatPanel.html",
        link: function(scope, elem, attrs){
            console.log('in chat link')
            scope.open = SliderFactory.slideOut.bind(null, 'chat');    
        }
    };
});