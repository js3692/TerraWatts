app.directive('message', function(PlayGameFactory, $sce){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/message/message.html',
        scope: {
            message: '=',
            chatBox: '='
        },
        link: function(scope, elem, attrs){
            scope.chatBox.scrollTop = scope.chatBox.scrollHeight;

            var colorMap = PlayGameFactory.getTurnOrder().map(function (player) {
                return {
                    name: player.user.username,
                    color: player.color
                }
            });

            function color(string) {
                colorMap.forEach(function (colorObj) {
                    var re = new RegExp(colorObj.name, 'g');
                    var withHTML = '<span style="color:' + colorObj.color + '">' + colorObj.name + '</span>';
                    string = string.replace(re, withHTML);
                })
                return string;
            }

            scope.trust = function(string) {
                return $sce.trustAsHtml(string);
            }

            scope.user = color(scope.message.user);
            scope.text = color(scope.message.message);           
        }
    }
})