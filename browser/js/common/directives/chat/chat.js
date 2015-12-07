app.directive('chat', function(FirebaseFactory, PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/chat/chat.html',
        scope: {
            me: '=',
            key: '='
        },
        link: function(scope, elem, attrs){
            scope.key = scope.key || PlayGameFactory.getKey();
            
            scope.chatBox = document.getElementById('chat-window');
            var chatRef = FirebaseFactory.getChat(scope.key);
            
            scope.addToChat = function(){
                
                chatRef.push({ 
                    user: scope.me || PlayGameFactory.getMe().user.username, 
                    message: scope.message 
                });
              
                scope.message = '';
            }
 
            scope.chatHistory = [];
            
            chatRef.on('child_added', function(snapshot){
                var message = snapshot.val();
                scope.chatHistory.push(message);
            });
        }
    }
})