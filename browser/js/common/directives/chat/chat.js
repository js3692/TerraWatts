app.directive('chat', function(FirebaseFactory, PlayGameFactory){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/chat/chat.html',
        link: function(scope, elem, attrs){
            
            scope.key = PlayGameFactory.getKey();
            
            scope.chatBox = document.getElementById('chat-window');
            var chatRef = FirebaseFactory.getChat(scope.key);
            
            scope.addToChat = function(){
                
                chatRef.push({ 
                    user: PlayGameFactory.getMe().user.username, 
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