angular.module('app').directive('menu',menu);

function menu() {


    return {
        restrict: "A",
        templateUrl: "partials/nav",
        scope: {},
        controller: function ($scope, $rootScope) {

        }
    }

}
