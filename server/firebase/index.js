var Firebase = require('firebase'),
    gridHash = {},
    baseUrl = "https://amber-torch-6713.firebaseio.com/";

module.exports = {
    base: function() {
        return new Firebase(baseUrl);
    },
    setConnection: function(key) {
        gridHash[key] = new Firebase(baseUrl + key);
    },
    getConnection: function(key) {
        if(!gridHash[key]) this.setConnection(key);
        return gridHash[key];
    },
    getConnectionToGame: function (gridKey) {
        return new Firebase(baseUrl + gridKey + '/game');
    },
    getConnectionToState: function (gridKey) {
        return new Firebase(baseUrl + gridKey + '/state');
    },
    getConnectionToPlayers: function (gridKey) {
        return new Firebase(baseUrl + gridKey + '/players');
    }
};