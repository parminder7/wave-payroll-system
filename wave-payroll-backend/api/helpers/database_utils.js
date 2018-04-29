'use strict';

var mysql = require('mysql');
var config = require('../../config/config').getconfig();
var log4js = require('log4js');
var logger = log4js.getLogger('console');

module.exports = {
  connect_to_database: connect_to_database
};

function connect_to_database(callback){
  let connection = mysql.createConnection({
    host     : config.dbHost,
    user     : config.dbUser,
    password : config.dbPassword,
    database : config.dbName
  });

  connection.connect(function(err){
    if (err){
      logger.error(`Database connection failed! ${err}`);
      return callback(err);
    }
    logger.info('Connected to database : %s', config.dbHost);
    return callback(null, connection);
  });
}