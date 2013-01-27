'use strict';

/* Routing */

var cake_shop = angular.module('cake_shop', []);

cake_shop.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    	when('', {templateUrl: 'partials/home.html'}).
        when('/home', {templateUrl: 'partials/home.html'}).
    	when('/pasteleria', {templateUrl: 'partials/cake_list.html', controller: CakeListCtrl}).
        when('/mini_pasteleria', {templateUrl: 'partials/cake_list.html', controller: MiniCakeListCtrl}).
    	when('/contacto', {templateUrl: 'partials/contact.html'}).
        when('/tortas/:tortaId', {templateUrl: 'partials/cake_detail.html', controller: CakeDetailCtrl});
}]);

/* Controllers */

function filtrar_tipo(list, type) {
    var cake_list = [];

    for(var i = 0; i < list.length; i++) {
        if (list[i].tipo == type) {
            cake_list.push(list[i]);
        }
    }

    return cake_list;
}

function CakeListCtrl($scope, $http, $location) {
    $http.get('data/cakes.json').success(function(data) {
        $scope.cake_list = filtrar_tipo(data, "pasteleria");
    });
}

function MiniCakeListCtrl($scope, $http, $location) {
    $http.get('data/cakes.json').success(function(data) {
        $scope.cake_list = filtrar_tipo(data, "mini_pasteleria");
        $scope.mini_pasteleria = true;
    });
}

function CakeDetailCtrl($scope, $http, $location, $routeParams) {
    $http.get('data/cakes.json').success(function(data) {

        if (isNaN(parseInt($routeParams.tortaId, 10)) || $routeParams.tortaId > data.length) {
            $location.path("/home");
        }

        $scope.cake = data[$routeParams.tortaId - 1];
    });
}

cake_shop.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page == currentRoute ? 'active' : '';
    };
}]);

/* Directives */

cake_shop.directive('popover', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs)
        {
            $(element)
                .attr('title', scope.$eval(attrs.title))
                .attr('data-content', scope.$eval(attrs.description))
                .popover({ trigger : 'hover', placement: function (tip, element) {
                    var offset = $(element).offset();
                    var height = $(document).outerHeight();
                    var width = $(document).outerWidth();
                    var vert = 0.5 * height - offset.top;
                    var vertPlacement = vert > 0 ? 'bottom' : 'top';
                    var horiz = 0.5 * width - offset.left;
                    var horizPlacement = horiz > 0 ? 'right' : 'left';
                    return Math.abs(horiz) > Math.abs(vert) ?  horizPlacement : vertPlacement;
                }});
        }
    }
});