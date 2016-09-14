angular.module('app').controller('HomeController', HomeController);

function HomeController($rootScope, Api) {
    var vm = this;
    
    
    console.log($rootScope.loading);
    $rootScope.loading = false;
    console.log($rootScope.loading);
    
}