angular.module('app').controller('HomeController', HomeController);

function HomeController($rootScope) {
    var vm = this;

    console.log($rootScope.loading);
    $rootScope.loading = false;
    console.log($rootScope.loading);
}