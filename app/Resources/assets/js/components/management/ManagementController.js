angular.module('app').controller('ManagementController', ManagementController);

function ManagementController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

}