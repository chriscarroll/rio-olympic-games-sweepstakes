var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: app.get('views') });
});

module.exports = router;
