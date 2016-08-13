var express = require('express');
var http = require('http');

var router = express.Router();

var options = {
  host: 'www.medalbot.com',
  path: '/api/v1/medals'
};

/* GET medals listing. */
router.get('/', function(req, res, next) {
  httpGet(options, function(statusCode, result) {
    res.statusCode = statusCode;
    res.send(JSON.stringify(result));
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
      onResult(res.statusCode, JSON.parse(body));
    });
  });

  req.on('error', function(err) {
    console.log('ERROR: ' + err.message);
  });
};

module.exports = router;
