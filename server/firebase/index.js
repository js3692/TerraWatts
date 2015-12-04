var Firebase = require('firebase')
var gridHash = {},
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
    disconnect: function (key) {
        this.getConnection(key).onDisconnect().remove();
    }
};