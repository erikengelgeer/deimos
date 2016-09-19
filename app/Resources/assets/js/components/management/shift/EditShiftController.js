/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditShiftController', EditShiftController);

function EditShiftController($rootScope, Api, $stateParams, $q) {
    var vm = this;
    var shiftTypeId = $stateParams.shiftTypeId;
    var promises = [];

    vm.teams = [];


    promises.push(Api.shiftType.findOne(shiftTypeId).then(function (response) {
        vm.editShiftTypes = response.data;
        console.log(response.data);

        vm.editShiftTypes.default_end_time = new Date(vm.editShiftTypes.default_end_time);
        vm.editShiftTypes.default_start_time = new Date(vm.editShiftTypes.default_start_time)

    }));

    promises.push(Api.teams.find().then(function (response) {
        vm.teams = response.data;
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.teams, vm.editShiftTypes);
    }).finally(function () {
        $rootScope.loading = false;
    });
}