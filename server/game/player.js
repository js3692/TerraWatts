module.exports = function(){
    var colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
    return {
        createPlayer: function Player(user, color){
            this.user = user;
            this.plants = [];
            this.money = 50;

            // check if player is allowed to pick color;
            var colorIdx = colors.indexOf(color);
            if(colorIdx === -1 ) throw new Error('Color taken.');
            colors.splice(colorIdx, 1);
            this.color = color;


            this.resources = {};

        }
    }
};