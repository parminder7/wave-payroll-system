'use strict';

var configs = require('./config.json');
var path = require('path');

module.exports.getconfig = function () {
  configs.dbHost = process.env.DB_HOST || configs.dbHost;
  configs.dbName = process.env.DB_NAME || configs.dbName;
  configs.dbUser = process.env.DB_USER || configs.dbUser;
  configs.dbPassword = process.env.DB_PASSWORD || configs.dbPassword;
  configs.uploadDir = process.env.UPLOAD_DIR || configs.uploadDir;
  configs.errorDir = process.env.ERROR_DIR || configs.errorDir;
  configs.dbTable = process.env.DB_TABLE || configs.dbTable;
  return configs;
};
