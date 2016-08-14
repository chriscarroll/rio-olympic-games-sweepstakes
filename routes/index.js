var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
// TODO: is this doing anything?
router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: app.get('public')});
});

module.exports = router;
