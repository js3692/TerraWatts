var Firebase = require('firebase');
var gridHash = {};
var baseUrl = "https://amber-torch-6713.firebaseio.com/";

module.exports = {
    base: function() {
        return new Firebase(baseUrl);
    },
    setConnection: function(key) {
        gridHash[key] = new Firebase(baseUrl + key);
    },
    getConnection: function(key) {
        return gridHash[key];
    }
};