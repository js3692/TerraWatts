var State = require('../state');
var determineTurnOrder = require('../utils/turnOrder.js');
var verifyResources = require('../utils/resourceVerification').verifyResources;
var totalPrice = require('./price');
var CityState = require('../cityState')

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


var ResourceState = function (game){
    this.game = game;
    this.validators = validators;
    this.turnIndex = 1;
    State.call(this);
}

ResourceState.prototype = Object.create(State.prototype);
ResourceState.prototype.constructor = ResourceState;

ResourceState.prototype.go = function() {
    // redo turn order if first turn
    if (this.game.turn === 1) {
        this.game.turnOrder = determineTurnOrder(this.game.turnOrder);
    }
    this.game.activePlayer = this.game.turnOrder.slice(-1)[0];
    // return save/update game
}

ResourceState.prototype.continue = function(wishlist) {
    // find the player
    var player = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
    player.money -= totalPrice(wishlist, this.game.resourceMarket);
    // resources are moved from market to player
    for(var resource in wishlist) {
        this.game.resourceMarket[resource] -= wishlist[resource];
        player.resources[resource] += wishlist[resource];
    }
    this.turnIndex++;
    if(this.turnIndex > this.game.turnOrder.length) {
        // transition to city building state
        this.game.currentState = new CityState(this.game);
        this.game.currentState.go();
    } else {
        this.game.activePlayer = this.game.turnOrder[this.game.turnOrder.length - this.turnIndex];
        // return save/update game;
    }

}

module.exports = ResourceState;


                           
                           
                           
                            