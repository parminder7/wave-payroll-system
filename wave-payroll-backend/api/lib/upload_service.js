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
  upload: save_file_to_upload_dir,
  uploadStatus: upload_status
};

function upload_status(fileId, callback){
  if (!fileId){
    // check if upload dir has anything left for processing
    fs.readdir(config.uploadDir, function(err, files){
      if (err){
        logger.error(`Error occurred while checking upload dir, err: ${err}`);
        return callback(err);
      }
      if (!files.length) {
        logger.info(`Upload dir is empty currently`);
        return callback(null, {status: 'success'});
      }
      return callback(null, {status: 'in-progress'});
    });
  }
  // otherwise, check if given file id is present in upload folder
  // if present, return in-progress status
  // if not present, check error dir (if present in error dir, return fail status)
  // ortherwise, return processed/succeeded status
  let file_uploadpath = path.join(config.uploadDir, fileId);
  let file_errorpath = path.join(config.errorDir, fileId);
  fs.stat(file_uploadpath, function(err){
    if (!err){ // file found
      logger.warn(`${fileId} found in upload path`);
      return callback(null, {status: 'in-progress'});
    }
    if (err.code === 'ENOENT'){ // file not found
      fs.stat(file_errorpath, function(err){
        if (!err) {
          logger.warn(`${fileId} found in error path`);
          return callback(null, {status: 'fail'});
        }
        if (err.code === 'ENOENT'){ // file not found
          logger.info(`Upload and error dir has no ${fileId}`);
          return callback(null, {status: 'success'});
        }
        else {
          logger.error(`Error occurred while checking error dir, err: ${err}`);
          return callback(err);
        }
      });
    }
    else {
      logger.error(`Error occurred while checking upload dir, err: ${err}`);
      return callback(err);
    }
  });
}

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