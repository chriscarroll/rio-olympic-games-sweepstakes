var express = require('express');
var path = require('path');
var router = express.Router();

var app = express();

// GET teams listing
router.get('/', function(req, res, next) {
  res.sendFile('teams_2016.json', {root: path.join(__dirname, '../public/resources/data')});
});

module.exports = router;
