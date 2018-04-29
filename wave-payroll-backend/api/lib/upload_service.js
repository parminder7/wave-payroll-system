'use strict';

var async = require('async');
var _ = require('lodash');
var fs = require('fs');
const uuidv4 = require('uuid/v4');
var config = require('../../config/config').getconfig();
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger('console');
logger.level = 'debug';

module.exports = {
  upload: save_file_to_upload_dir
};

function save_file_to_upload_dir(files, callback){
  // safeguard for empty file array
  if (_.size(files) === 0){
    let err = new Error('File argument is not provided');
    return callback(err);
  }

  // copy file from temp file location to parallel
  async.map(files, upload_file, function(err, result){
    if (err){
      logger.error(`Failed to upload in save_file_to_upload_dir ${err}`);
      return callback(err);
    }
    logger.info(`File(s) uploaded successfully`);
    return callback(null, result);
  });
}

function upload_file(file, callback){
  let filename = generate_unique_file_id();
  let upload_path = path.join(config.uploadDir, filename);
  let temp_path = file.path || '';
  let readstream = fs.createReadStream(temp_path);
  let writestrem = fs.createWriteStream(upload_path);

  // move file from temp loc to upload directory
  readstream.pipe(writestrem);

  readstream.on('end', function(err){
    if (err){
      logger.error(`Upload failed at upload_file method, err: ${err}`);
      removefile(temp_path);
      removefile(upload_path);
      return callback(err);
    }
    removefile(temp_path);
    return callback(null, {"jobId": filename});
  });

  readstream.on('error', function(err){
    logger.error(`Upload failed at upload_file method, err: ${err}`);
    return callback(err);
  });
}

function removefile(file){
  if (file) {
    fs.unlink(file);
  }
}

function generate_unique_file_id(){
  return uuidv4() + '.csv';
}