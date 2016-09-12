angular.module('app').controller('ShiftController', ShiftController);

function ShiftController(Api, $scope, $rootScope) {
    var vm = this;

    console.log($rootScope.loading);

    Api.getShift().then(function (response) {
       $scope.shift = respone(data);
    });
}