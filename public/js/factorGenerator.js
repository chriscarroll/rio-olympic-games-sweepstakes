var fs = require('fs');
var path = require('path');
var readableStream = fs.createReadStream(path.join(__dirname, '../resources/data/medal_count_2012.tsv'));
var data = '';

// Constants
var GOLD_POINTS = 10;
var SILVER_POINTS = 5;
var BRONZE_POINTS = 3;
var MAX_POINTS_FACTOR = 20;

readableStream.on('data', function(chunk) {
  data += chunk;
});

readableStream.on('end', function() {
  var countryData = tsvToJson(data);
  console.log('*** country json data created ***');
  console.log(JSON.stringify(countryData));
  var factorData = generateFactors(countryData);
  console.log('*** factor json data created ***');
  console.log(JSON.stringify(factorData));
  fs.writeFile(path.join(__dirname, '../resources/generated/country_factors_2016.json'), JSON.stringify(factorData), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
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
  return result;
}

// Function to generate factors for all countries based on 2012 olympic games results
function generateFactors(jsonData) {
  var result = [];
  for (var i = 0, length = jsonData.length; i < length; i++) {
    var totalPoints = jsonData[i].gold * GOLD_POINTS + jsonData[i].silver * SILVER_POINTS + jsonData[i].bronze * BRONZE_POINTS;
    var factor = (100 / totalPoints).toFixed(5);

    // a country's factor can't exceed 20 points
    factor = factor > MAX_POINTS_FACTOR ? MAX_POINTS_FACTOR : factor;

    var obj = {
      country: jsonData[i].country,
      code: jsonData[i].code,
      factor: factor
    };
    result.push(obj);
  }
  return result;
}
