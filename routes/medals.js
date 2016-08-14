var express = require('express');
var http = require('http');

var router = express.Router();

var HOST_URL = 'www.medalbot.com';
var BASE_API_URL = '/api/v1/medals';

// GET medals listing
router.get('/', function(req, res, next) {
  httpGet({host: HOST_URL, path: BASE_API_URL}, function(statusCode, result) {
    res.statusCode = statusCode;
    res.send(JSON.parse(result));
  });
});

// GET medals listing by country (id param)
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  httpGet({host: HOST_URL, path: BASE_API_URL + '/' + id}, function(statusCode, result) {
    res.statusCode = statusCode;
    res.send(JSON.parse(result));
  });
});

var httpGet = function(options, onResult) {
  var req = http.get(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      onResult(res.statusCode, body);
    });
  });

  req.on('error', function(err) {
    console.log('ERROR: ' + err.message);
  });
};

module.exports = router;
