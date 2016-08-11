var fs = require('fs');
var path = require('path');
var readableStream = fs.createReadStream(path.join(__dirname, '../resources/data/medal_count_2012.tsv'));
var data = '';

// Constants
var GOLD_POINTS = 10;
var SILVER_POINTS = 5;
var BRONZE_POINTS = 3;

readableStream.on('data', function(chunk) {
  data += chunk;
});

readableStream.on('end', function() {
  var jsonData = tsvToJson(data);
  console.log('*** json data created ***');
  console.log(JSON.stringify(jsonData));
  var factorData = generateFactors(jsonData);
  console.log('*** factor data created ***');
});

// Function to convert tsv file with column headers to json
function tsvToJson(tsvData) {
  var lines = tsvData.split('\n');
  var result = [];
  var headers = lines[0].split('\t');

  for (var i = 1, lineLength = lines.length; i < lineLength; i++) {
    var obj = {};
    var currentLine = lines[i].split('\t');

    for (var j = 0, headerLength = headers.length; j < headerLength; j++) {
      obj[headers[j]] = currentLine[j];
    }
    result.push(obj);
  }
  //return JSON.stringify(result);
  return result;
}

// Function to generate factors for all countries at previous olympics
function generateFactors(jsonData) {
  for (var i = 0, length = jsonData.length; i < length; i++) {
    var totalPoints = jsonData[i].gold * GOLD_POINTS + jsonData[i].silver * SILVER_POINTS + jsonData[i].bronze * BRONZE_POINTS;
    var factor = (100 / totalPoints).toFixed(5);
    console.log(jsonData[i].country + ' ' + factor);
  }
}
