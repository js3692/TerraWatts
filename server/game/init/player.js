module.exports = function() {
    var colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
    return function Player(user, color, clockwise){
        this.user = user;
        this.plants = [];
        this.money = 50;

        // check if player is allowed to pick color.
        var colorIdx = colors.indexOf(color);
        if(colorIdx === -1 ) throw new Error('Color overlap');
        colors.splice(colorIdx, 1);
        this.color = color;

        this.resources = {coal: 0, oil: 0, trash: 0, nuke: 0};
        this.clockwise = clockwise;


        this.numCities = 0;
    }
}


