'use strict';

/* Routing */

var cake_shop = angular.module('cake_shop', []);

cake_shop.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    	when('/home', {templateUrl: 'partials/home.html'}).
    	when('/galeria', {templateUrl: 'partials/cake_list.html', controller: CakeListCtrl}).
    	when('/contacto', {templateUrl: 'partials/contact.html'}).
        when('/tortas/:tortaId', {templateUrl: 'partials/cake_detail.html', controller: CakeDetailCtrl}).
    	otherwise({redirectTo: 'home'});
}]);

/* Controllers */

function CakeListCtrl($scope, $http, $location) {
    $http.get('data/cakes.json').success(function(data) {
        $scope.cake_list = data;
    });
}

function CakeDetailCtrl($scope, $http, $location, $routeParams) {
    $http.get('data/cakes.json').success(function(data) {

        var number_of_cakes = data.length;

        if (isNaN(parseInt($routeParams.tortaId, 10)) || $routeParams.tortaId > number_of_cakes) {
            $location.path("/home");
        }

        for(var i = 0; i < number_of_cakes; i++) {
            if (data[i].id == $routeParams.tortaId) {
                $scope.cake = data[i];
                break;
            }
        }
    });
}

cake_shop.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page == currentRoute ? 'active' : '';
    };
}]);

/* Filters */

cake_shop.filter('grouped', function() {
  return function(input, itemsPerRow) {
    if (itemsPerRow === undefined) {
      itemsPerRow = 1;
    }

    var out = [];
    for (var i = 0; i < input.length; i++) {

      var rowElementIndex = i % itemsPerRow;
      var rowIndex = (i - rowElementIndex) / itemsPerRow;
      var row;
      if (rowElementIndex === 0) {
        row = [];
        out[rowIndex] = row;
      } else {
        row = out[rowIndex];
      }

      row[rowElementIndex] = input[i];
    }

    return out;
  };
});

/* Directives */

cake_shop.directive('popover', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs)
        {
            $(element)
                .attr('title', scope.$eval(attrs.title))
                .attr('data-content', scope.$eval(attrs.description))
                .popover({ trigger : 'hover', placement : 'bottom'});
        }
    }
})