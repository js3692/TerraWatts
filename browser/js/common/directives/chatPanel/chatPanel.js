app.directive('chatPanel', function(SliderFactory, FirebaseFactory){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/chatPanel/chatPanel.html",
        link: function(scope, elem, attrs){
            scope.openChat = SliderFactory.slideOut.bind(null, 'chat');  
        }
    };
});