var path = require('path');
var testingConfigPath = path.join(__dirname, './testing.js');
var devConfigPath = path.join(__dirname, './development.js');
var productionConfigPath = path.join(__dirname, './production.js');

if (process.env.NODE_ENV === 'testing') {
		module.exports = require(testingConfigPath);
} else if (process.env.NODE_ENV === 'production') {
    module.exports = require(productionConfigPath);
} else {
    module.exports = require(devConfigPath);
}