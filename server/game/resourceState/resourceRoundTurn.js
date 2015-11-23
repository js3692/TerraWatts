var State = require('./state');

var Turn = function (game, player, validators, nextState){
    this.game = game;
    this.game.player = player;
    this.validators = validators;
    this.nextState = nextState;
    State.call(this);
}


Turn.prototype = Object.create(State.prototype);
Turn.prototype.constructor = State;

Turn.prototype.endTurn = function(condition) {
    this.game.turn = new this.nextState();
}

module.exports = Turn;