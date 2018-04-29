'use strict';

var reportService = require('../lib/report_service');

module.exports = {
  fetchRecord: fetchRecord
};

function fetchRecord(req, res) {
  var pageId = req.swagger.params.pageId.value || null;
  reportService.fetchPage(pageId, function(err, result){
    if (err){
      res.status(400);
      return res.json({ success: 'false', error: err.message });
    }
    res.status(200);
    return res.json({ success: 'true', result: result });
  });
}