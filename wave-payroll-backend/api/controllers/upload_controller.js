'use strict';

var uploadService = require('../lib/upload_service');

module.exports = {
  checkUploadStatus: checkUploadStatus,
  uploadFile: uploadFile
};

function checkUploadStatus(req, res) {
  var fileId = req.swagger.params.fileId.value || null;
  uploadService.uploadStatus(fileId, function(err, result){
    if (err){
      res.status(400);
      return res.json({ success: 'false', error: err.message });
    }
    res.status(200);
    return res.json({ success: 'true', result: result });
  });
}

function uploadFile(req, res) {
  var files = req.files.file || {};
  uploadService.upload(files, function(err, result){
    if (err){
      res.status(400);
      return res.json({ success: 'false', error: err.message });
    }
    res.status(201);
    return res.json({ success: 'true', result: result });
  });
}