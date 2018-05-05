'use strict';

var mysql = require('mysql');
var config = require('../../config/config').getconfig();
var log4js = require('log4js');
var logger = log4js.getLogger('console');

module.exports = {
  connect_to_database: connect_to_database
};

var db_config = {
  host     : config.dbHost,
  user     : config.dbUser,
  password : config.dbPassword,
  database : config.dbName
};


function connect_to_database(callback){
  let connection = mysql.createConnection(db_config);

  handle_disconnect(connection);

  connection.connect(function(err){
    if (err){
      logger.error(`Database connection failed! ${err}`);
      connection.end(function(err) {
        // The connection is terminated now
      });
      return callback(err);
    }
    logger.info('Connected to database : %s', config.dbHost);
    return callback(null, connection);
  });
}

function handle_disconnect(connection) {
  connection.on('error', function(error) {
    logger.error(`Handle disconnect on error - ${error}`);

    connection.end(function(err) {
      // The connection is terminated now
    });
  });
}