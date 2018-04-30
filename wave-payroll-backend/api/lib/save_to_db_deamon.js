'use strict';

var mysql = require('mysql');
var parse = require('csv-parser');
var fs = require('fs');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('console');
var chokidar = require('chokidar');
var _ = require('lodash');
var utils = require('../helpers/utils');
var dbutils = require('../helpers/database_utils');
var path = require('path');
var config = require('../../config/config').getconfig();
logger.level = 'debug';

const REPORT_ID_FIELD = 'report id';

// exported methods to access outside file
module.exports = {
  process_pending_jobs: process_pending_jobs
};

function process_pending_jobs(){
  async.waterfall([
    dbutils.connect_to_database,
    process_files
  ], function (err){

  });
}

function process_files(conn, callback){
  // initialize watcher on directory and ignore system (dot) files
  const watcher = chokidar.watch(config.uploadDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  // attach event handler on a new file add
  watcher
    .on('add', fpath => {
    logger.info(`ADD event triggered by file ${fpath}`);
    async.waterfall([
      async.apply(parse_csv, fpath),
      async.apply(load_to_db, conn)
    ], function(err){
      if (err){
        logger.error(`Error parsing and loading data from CSV to database ${err}`);
        let to = path.join(config.errorDir, fpath.replace(/^.*[\\\/]/, ''));
        movefile(fpath, to, function(error){
          if (err) return callback(error);
          return callback(err);
        });
      }
      // remove file after processing is done
      removefile(fpath, callback);
    });
    })
    .on('error', error => {
      logger.error(`Failed in watcher: ${error}`);
      return callback(error);
    })
}

function movefile(from, to, callback){
  fs.rename(from, to, function(err){
    if (err){
      logger.error(`Error moving file from upload dir to error dir: ${err}`);
      return callback(err);
    }
    logger.info(`Moved file to error dir -- for retry later`);
    return callback(null);
  });
}

function removefile(path, callback){
  fs.unlink(path, (err) => {
    if (err) {
      logger.error(`Clean up failed after processing- file : ${path}`);
      return callback(err);
    }
    logger.info(`Clean up done after processing- file : ${path}`);
    // return callback(null);
  });
}

function parse_csv(path, callback){
  let data=[];
  let headers;
  let report_id = null;
  fs.createReadStream(path)
    .pipe(parse({delimiter: ','}))
    .on('data', function(row) {
      let formatted_row = [];
      let isfooter = false;
      headers.forEach( header => {
        // special handling for report id footer
        if (row[header] === REPORT_ID_FIELD){ //TODO: fail if report id already exists
          isfooter = true;
        }
        if (isfooter && row[header]) {
          report_id = row[header] ;
        }
        // special case: date needs to be formatted for sql insertion
        if (header === 'date'){
          formatted_row.push(format_date(row[header]));
        }
        else{
          formatted_row.push(row[header]);
        }
      });
      // push to array
      !isfooter && data.push(formatted_row);
    })
    .on('headers', function (headerList) {
      logger.info(`CSV header: ${headerList}`);
      headers = headerList;
    })
    .on('end',function() {
      logger.info(`Parsing completed - ${path}`);
      return callback(null, data, report_id);
    })
    .on('error', function(err){
      logger.error(`Error occured while parsing CSV file ${path}`);
      return callback(err);
    })
}

function format_date(date){
  let datearr = date.split('/');
  return datearr[2] + '-' + datearr[1] + '-' + datearr[0];
}

function get_pay_date(arow){
  // first element corresponds to date (as per assumption)
  let given_date = arow[0];
  // date format is 'yyyy-mm-dd'
  let mysql_date = given_date.split('-');

  console.log(mysql_date);

  // parseInt("", radix) radix is 10 for decimal
  let day = parseInt(mysql_date[2], 10);
  console.log("day= " + day);

  let pay_date;
  if (day >= 1 && day <= 15){
    pay_date = mysql_date[0] + '-' + mysql_date[1] + '-' + '15';
  }
  else{
    pay_date = mysql_date[0] + '-' + mysql_date[1] + '-' +
      utils.get_days_by_month(mysql_date[1], mysql_date[0]);
  }
  console.log('pay-date = ' + pay_date);
  return pay_date;
}

function append_pay_period_col(data){
  let resultant = _.map(data, function(arow){
    // get_pay_date(arow);
    return arow.push(get_pay_date(arow));
  });
  console.log(resultant);
  return resultant;
}

function load_to_db(conn, data, report_id, callback){
  // push report id to each row for sql query
  _.map(data, function(row){
    return row.push(report_id);
  });

  console.log(data);

  // add extra column for pay day for each row
  // data = append_pay_period_col(data);
  _.map(data, function(arow){
    // get_pay_date(arow);
    return arow.push(get_pay_date(arow));
  });

  // prepare sql query for bulk insertion
  let query = `INSERT INTO ${config.dbTable} (date, hours_worked, emp_id, job_group, report_id, pay_day) VALUES ?`;

  conn.query(query, [data], function(err) {
    if (err) {
      logger.error(`load_to_db insertion failed, query: ${query}`);
      // DONE: move file from upload dir to err dir (for re-try)
      return callback(err);
    }
    // conn.end();
    logger.info(`load_to_db insertion succeed`);
    return callback(null);
  });
}

// start processing pending jobs...
process_pending_jobs();