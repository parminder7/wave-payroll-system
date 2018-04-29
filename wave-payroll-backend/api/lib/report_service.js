'use strict';

var dbutils = require('../helpers/database_utils');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('console');

module.exports = {
  fetchPage: fetch_page
};

function fetch_page(pageId, callback){
  async.waterfall([
    dbutils.connect_to_database,
    get_number_of_rows,
    async.apply(compute_pagination_params, pageId),
    // run_query
  ], function(err, results){

  });
}

function get_number_of_rows(conn, callback){
  let get_count_query = `SELECT count(*) FROM(
                            SELECT emp_id , pay_day as pay_day, sum(hours_worked * pay) as pay_per_role FROM (pay_per_hour 
                                  right join (
                                        SELECT emp_id, hours_worked, job_group , pay_day FROM timesheet
                                      ) t1 on  t1.job_group  =  pay_per_hour.job_group
                                )group by emp_id, pay_day
                          ) counter;`;

  conn.query(get_count_query, function(err, result) {
    if (err) {
      logger.error(`get_count_query failed, query: ${get_count_query}`);
      return callback(err);
    }
    logger.info(`get_count_query succeed`);
    console.log(result);
    return callback(null, { conn: conn, result: result});
  });
}

function compute_pagination_params(obj, pageId, callback){
  // calculate parameters for limit query on the basis of pageId and obj
}

function fetch_record_query(){
  let fetch_all_query = `select emp_id, pay_day, sum(pay_per_role) from (  \n' +
    '        (\n' +
    '            select emp_id , pay_day as  pay_day, sum(hours_worked * pay) as pay_per_role from (pay_per_hour\n' +
    '                right join (\n' +
    '                    select emp_id, hours_worked, job_group , pay_day from timesheet \n' +
    '                ) t1 on  t1.job_group  =  pay_per_hour.job_Group\n' +
    '            )group by emp_id, pay_day          \n' +
    '        ) t2\n' +
    '    )group by emp_id , pay_day;`;
  let get_count_query = `select count(*) from (\n' +
    'select emp_id, pay_day, sum(pay_per_role) from (  \n' +
    '        (\n' +
    '            select emp_id , pay_day as  pay_day, sum(hours_worked * pay) as pay_per_role from (pay_per_hour\n' +
    '                right join (\n' +
    '                    select emp_id, hours_worked, job_group , pay_day from timesheet \n' +
    '                ) t1 on  t1.job_group  =  pay_per_hour.job_Group\n' +
    '            )group by emp_id, pay_day          \n' +
    '        ) t2\n' +
    '    )group by emp_id , pay_day) counter;`;
  let limit_query = `select emp_id, pay_day, sum(pay_per_role) from (  \n' +
    '        (\n' +
    '            select emp_id , pay_day as  pay_day, sum(hours_worked * pay) as pay_per_role from (pay_per_hour\n' +
    '                right join (\n' +
    '                    select emp_id, hours_worked, job_group , pay_day from timesheet \n' +
    '                ) t1 on  t1.job_group  =  pay_per_hour.job_Group\n' +
    '            )group by emp_id, pay_day          \n' +
    '        ) t2\n' +
    '    )group by emp_id , pay_day order by emp_id limit 2, 5;`;
}