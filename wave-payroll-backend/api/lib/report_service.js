'use strict';

var dbutils = require('../helpers/database_utils');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('console');
var _ = require('lodash');

module.exports = {
  fetchPage: fetch_page
};

const RECORD_PER_PAGE = 10; // default

function fetch_page(pageId, callback){
  async.waterfall([
    dbutils.connect_to_database,
    get_number_of_rows,
    async.apply(get_page_records, pageId),
  ], function(err, results){
    return callback(err, results);
  });
}

function get_number_of_rows(conn, callback){
  let get_count_query = `SELECT count(*) as count FROM(
                            SELECT emp_id , pay_day as pay_day, sum(hours_worked * pay) as pay_per_role FROM (pay_per_hour 
                                  RIGHT JOIN (
                                        SELECT emp_id, hours_worked, job_group , pay_day FROM timesheet
                                      ) t1 on  t1.job_group  =  pay_per_hour.job_group
                                )GROUP BY emp_id, pay_day
                          ) counter;`;
  run_query(conn, get_count_query, function(err, result){
    if (err)
      return callback(err);
    else{
      return callback(null, { conn: conn, rows: result && result.length > 0 && result[0].count || 0});
    }
  });
}

function get_page_records(pageId, obj, callback){
  // calculate parameters for limit query on the basis of pageId and obj
  let pages = Math.ceil(obj.rows / RECORD_PER_PAGE);
  let skip = pageId * RECORD_PER_PAGE;
  let query = `SELECT emp_id , pay_day as pay_day, sum(hours_worked * pay) as pay_per_role FROM (pay_per_hour 
                   RIGHT JOIN (
                        SELECT emp_id, hours_worked, job_group , pay_day FROM timesheet
                    ) t1 on  t1.job_group  =  pay_per_hour.job_group
                )GROUP BY emp_id, pay_day ORDER BY emp_id LIMIT ${skip}, ${RECORD_PER_PAGE}`;
  run_query(obj.conn, query, function(err, result){
    if (err)
      return callback(err);
    else{
      _.forEach(result, rec => {
        let date = new Date(rec.pay_day);
        rec.pay_day = date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear();
      });

      let retobj = {
        pagination: {
          pages: pages,
          current: pageId || 0,
          prev: pageId > 0 ? (pageId - 1) : undefined,
          next: pageId < (pages - 1) ? (pageId + 1) : undefined
        },
        records: {result}
      };
      return callback(null, retobj);
    }
  });
}

function run_query(conn, query, callback){
  conn.query(query, function(err, result) {
    if (err) {
      logger.error(`sql query failed, query: ${query}`);
      return callback(err);
    }
    logger.info(`sql query succeed, result: ${result}`);
    return callback(null, result);
  });
}