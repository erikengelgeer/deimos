/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('ShiftController', ShiftController);

function ShiftController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.shifts = [];
    vm.teams = [];

    promises.push(Api.shiftType.find().then(function (response) {
        vm.shifts = response.data;
        console.log(response);
    }));

    promises.push(Api.teams.find().then(function (response) {
        vm.teams = response.data;
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.shifts, vm.teams);
    }).finally(function () {
        $rootScope.loading = false;
    });


}