'use strict';
var path = require('path');
var chalk = require('chalk');
var util = require('util');

var rootPath = path.join(__dirname, '../../../');
var indexPath = path.join(rootPath, './server/app/views/index.html');
var faviconPath = path.join(rootPath, './server/app/views/favicon.ico');

var env = require(path.join(rootPath, './server/env'));

var logMiddleware = function (req, res, next) {
  var message = chalk.blue(util.inspect(req.ip));
  message += util.format(chalk.magenta(' %s %s'), req.method, req.path);
  if (Object.keys(req.query).length) message += chalk.yellow(' QUERY RECEIVED\n') + chalk.cyan(util.inspect(req.query));
  if (Object.keys(req.body).length) {
    if(req.path.slice(0, 9) === '/api/play') message += chalk.cyan(' BODY RECEIVED\n') + chalk.yellow(util.inspect(req.body));
    else {
      if(Object.keys(req.body).length > 2) message += chalk.cyan(' BODY RECEIVED\n') + chalk.yellow(util.inspect(req.body));
      else message += util.format(chalk.cyan(' %s: %s'), 'BODY', util.inspect(req.body));
    }
  } 
  util.log(message);
  next();
};

module.exports = function (app) {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
  app.setValue('faviconPath', faviconPath);
  app.setValue('log', logMiddleware);
};