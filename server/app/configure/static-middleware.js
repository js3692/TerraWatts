"use strict";
var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function (app) {

    var root = app.getValue('projectRoot');

    var npmPath = path.join(root, './node_modules');
    var bowerPath = path.join(root, './bower_components');
    var publicPath = path.join(root, './public');
    var browserPath = path.join(root, './browser');
    var plantPath = path.join(root, './symbols/plants');
    var resourcePath = path.join(root, './symbols/resources');
    var fontPath = path.join(root, './server/app/views/Orbitron');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(npmPath));
    app.use(express.static(bowerPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));
    app.use(express.static(plantPath));
    app.use(express.static(resourcePath));
    app.use(express.static(fontPath));

};
