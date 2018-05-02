'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var multer  = require('multer');
var cors = require('cors');

module.exports = app; // for testing

var upload = multer({ dest: './uploads/' });
app.use(upload.fields([{ name: 'file' }]));

var config = {
  appRoot: __dirname // required config
};

// Enable CORS middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
