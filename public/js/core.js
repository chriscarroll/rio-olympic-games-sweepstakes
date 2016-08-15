var app = angular.module('app', []);

app.controller('mainController', function($scope, $http, $q) {
  // Constants
  var GOLD_POINTS = 10;
  var SILVER_POINTS = 5;
  var BRONZE_POINTS = 3;

  $scope.results = [];

  var teams = $http.get('/teams');
  var medals = $http.get("/medals");
  var factors = $http.get("../resources/generated/country_factors_2016.json");

  $q.all([teams, medals, factors]).then(function(results) {
    for (var i = 0, teamsLength = results[0].data.length; i < teamsLength; i++) {
      var name = results[0].data[i].name;
      var countries = results[0].data[i].countries;
      var points = 0;
      for (var j = 0, countriesLength = countries.length; j < countriesLength; j++) {
        var factor = 0;
          // TODO: replace with lodash find, ie: _.find(results, {countryId: value});
          angular.forEach(results[1].data, function(valueB, index) {
            if (valueB.id === countries[j]) {
              angular.forEach(results[2].data, function(valueC, index) {
                if (valueC.countryId === countries[j]) {
                  factor = valueC.factor;
                }
              });
              points += (valueB.gold_count * GOLD_POINTS + valueB.silver_count * SILVER_POINTS + valueB.bronze_count * BRONZE_POINTS) * factor;
            }
        });
      }
      $scope.results.push({
        name: name,
        countries: countries,
        points: points.toFixed(2)/1
      });
    }
  });
});
