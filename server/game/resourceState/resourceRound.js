var State = require('./state');

var validators = [
    function hasPlayers(game){
        if(!game.players) throw new Error('Game has no players.');
    }, 
    function everyPlayerHadATurn(game){
        if(game.players.length !== this.turnIndex) throw new Error('Not every player has had a turn.')
    }
];


var ResourceRound = function (game){
    this.game = game;
    this.validators = validators;
    this.nextState = 'placeholder for building state constructor';
    this.turnIndex = 1;
    State.call(this);
}

ResourceRound.prototype = Object.create(State.prototype);
ResourceRound.prototype.constructor = State;

ResourceRound.prototype.endResourceRound = function() {
    this.game.currentState = new this.nextState;
};

module.exports = ResourceRound;


                           
                           
                           
                            