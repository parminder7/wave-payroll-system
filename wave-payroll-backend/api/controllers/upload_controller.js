'use strict';

var uploadService = require('../lib/upload_service');

module.exports = {
  checkUploadStatus: checkUploadStatus,
  uploadFile: uploadFile
};

function checkUploadStatus(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
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