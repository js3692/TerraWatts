var State = require('../state');
var determineTurnOrder = require('../utils/turnOrder.js');
var verifyResources = require('../utils/resourceVerification').verifyResources;
var totalPrice = require('./price');

var validators = [
    // function hasPlayers(game){
    //     if(!game.players) throw new Error('Game has no players.');
    // }, 
    // function everyPlayerHadATurn(game){
    //     if(game.players.length !== this.turnIndex) throw new Error('Not every player has had a turn.')
    // }
    function enoughResources(game, wishlist) {
        return wishlist.every(function (resource) {
            return wishlist[resource] <= game.resourceMarket[resource];
        })
    },
    function withinPlantMax(game, wishlist) {
        return verifyResources(game.activePlayer, wishlist);
    },
    function canAfford(game, wishlist) {
        return totalPrice(wishlist, game.resourceMarket) <= game.activePlayer.money;
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

ResourceRound.prototype.go = function() {
    if (this.game.turn === 1) {
        this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
    }
    this.game.activePlayer = this.game.turnOrder.slice(-1)[0];
    return this.game;
}

ResourceRound.prototype.continue = function(wishlist) {
    var player = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
    player.money -= totalPrice(wishlist, this.game.resourceMarket);
    for(var resource in wishlist) {
        this.game.resourceMarket[resource] -= wishlist[resource];
    }
    this.turnIndex++;
    if(this.turnIndex > this.game.turnOrder.length) {
        // transition to city building state
    } else {
        this.game.activePlayer = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
    }
    return this.game;

}

ResourceRound.prototype.endResourceRound = function() {
    this.game.currentState = new this.nextState;
};

module.exports = ResourceRound;


                           
                           
                           
                            