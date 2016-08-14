var app = angular.module('app', []);

app.controller('mainController', function($scope, $http, $q) {
  // Constants
  var GOLD_POINTS = 10;
  var SILVER_POINTS = 5;
  var BRONZE_POINTS = 3;

  $scope.results = [];

  $http.get('/teams').then(function(response) {
    var deferred = $q.defer();
    var urlCalls = [];
    for (var i = 0, teamsLength = response.data.length; i < teamsLength; i++) {
      var obj = {
        name: response.data[i].name,
        countries: response.data[i].countries
      };
      $scope.results.push(obj);
      for (var j = 0, countriesLength = response.data[i].countries.length; j < countriesLength; j++) {
        // TODO: Factor calculation/substitution
        var promise = $http.get('/medals/' + response.data[i].countries[j]).then(function(response) {
          return {
            countryId: response.data.id,
            gold: response.data.gold_count,
            silver: response.data.silver_count,
            bronze: response.data.bronze_count,
            points: response.data.gold_count * GOLD_POINTS + response.data.silver_count * SILVER_POINTS + response.data.bronze_count * BRONZE_POINTS,
            factor: 1
          };
        }, function(err) {
          // Country has won no medals so default everything to 0
          if (err.data && err.data.error_msg) {
            console.log('Error: ' + err.data.error_msg);
          } else {
            console.dir(err);
          }
          // TODO: This isn't pretty but necessary for now to work with the multiple xhr requests needed for this data
          return {
            countryId: err.config.url.replace('/medals/', ''),
            gold: 0,
            silver: 0,
            bronze: 0,
            points: 0,
            factor: 0
          };
        });
        urlCalls.push(promise);
      }
    }
    $q.all(urlCalls).then(function(results) {
        //deferred.resolve(results);
        for (var i= 0; i < $scope.results.length; i++) {
          var points = 0;
          angular.forEach($scope.results[i].countries, function(valueA, index) {
            // TODO: replace with lodash find, ie: _.find(results, {countryId: value});
            angular.forEach(results, function(valueB, index) {
              if (valueB.countryId === valueA) {
                points += valueB.points;
              }
            });
          });
          $scope.results[i].points = points;
        }
      },
      function(errors) {
        deferred.reject(errors);
      },
      function(updates) {
        deferred.update(updates);
      });
  });
});
