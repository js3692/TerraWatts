app.directive('chat', function(FirebaseFactory, PlayGameFactory, $timeout){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/chat/chat.html',
        scope: {
            me: '=',
            key: '='
        },
        link: function(scope, elem, attrs){
            scope.key = scope.key || PlayGameFactory.getKey();

            function TourChat() {
                this.arr = [];
                this.events = {};
                this.count = 0;
            }

            var tourMessages = [
                'Hey, beautiful',
                'Play the real game!',
                'The creators of this game are very nice.',
                'You should consider hiring them...'
            ];

            TourChat.prototype.push = function(message) {
                this.arr.push(message);
                this.emit('child_added', message);
                $timeout(() => {
                    this.emit('child_added', {
                        user: 'TerraLord',
                        message: tourMessages[this.count%messages.length]
                    });
                    this.count++;
                }, 1000)
            }

            TourChat.prototype.on = function(event, cb) {
                if(this.events[event]) {
                    this.events[event].push(cb);
                } else {
                    this.events[event] = [cb];
                }
            }

            TourChat.prototype.emit = function(event, payload) {
                if(this.events[event]) {
                    this.events[event].forEach(function(cb) {
                        cb(payload);
                    })
                }
            }

            scope.chatBox = document.getElementById('chat-window');
            var chatRef = FirebaseFactory.getChat(scope.key) || new TourChat();

            scope.addToChat = function(){

                chatRef.push({
                    user: scope.me || PlayGameFactory.getMe().user.username,
                    message: scope.message
                });

                scope.message = '';
            }

            scope.chatHistory = [];

            chatRef.on('child_added', function(snapshot){
                var message;
                if(snapshot.val) message = snapshot.val();
                else message = snapshot;
                scope.chatHistory.push(message);
            });
        }
    }
})
