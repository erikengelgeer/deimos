/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('ShiftController', ShiftController);

function ShiftController($rootScope, Api, $q, $state) {
    var vm = this;
    var promises = [];

    vm.shifts = null;
    vm.teams = null;
    vm.selectedShiftType = null;

    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }

    console.log($rootScope.user.role_fk.role);

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

    function showDisableModal(shift) {
        vm.selectedShiftType = shift;
        $('#disable-shift-modal').modal('show');
    }

    function disable(shift) {
        $('#disable-shift-modal').modal('hide');
        shift.disableLoading = true;
        Api.shiftType.disable(shift.id).then(function () {
            vm.message = {
                'title': 'Successfully disabled',
                'content': '<em>' + shift.short + '</em> is successful disabled.',
                'icon': 'fa-check',
                'type': 'alert-success'
            }

            _.remove(vm.shifts, function (item) {
                return item.id == shift.id;
            })
        }, function errorCallback(response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        }).finally(function () {
            team.disableLoading = false;
            vm.selectedTeam = null;
        });
    }
}