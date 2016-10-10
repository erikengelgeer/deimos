/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditShiftController', EditShiftController);

function EditShiftController($rootScope, Api, $stateParams, $q, $state) {
    var vm = this;
    var shiftId = $stateParams.shiftTypeId;

    vm.teams = null;
    vm.shift = null;

    vm.update = update;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index')
    }

    // Make a promise
    var promises = [];

    // Fetch the team with the given team id.
    promises.push(Api.shiftType.findOne(shiftId).then(function (response) {
        vm.shift = response.data;
        vm.shift.default_end_time = new Date(vm.shift.default_end_time);
        vm.shift.default_start_time = new Date(vm.shift.default_start_time);
        console.log(vm.shift.team_fk)
    }));

    // Fetch the team with the given team id.
    promises.push(Api.teams.find().then(function (response) {
        vm.teams = response.data;
    }));

    $q.all(promises).catch(function (response) {
        vm.message = {
            'title': response.status + ', ' + response.statusText + '.',
            'content': 'Please notify the admin regarding this error.',
            'icon': 'fa-exclamation',
            'type': 'alert-danger'
        }
    }).finally(function () {
        $rootScope.loading = false;
    });

    function update() {
        console.log(vm.shift);
        if(vm.shift.team_fk == null || vm.shift.description == null || vm.shift.short == null) {
            // if fields is empty, show error message.
            vm.message = {
                'title': 'Fields may not be blank',
                'content': 'Please fill in all the required fields.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else if (vm.shift.short.length > 3) {
            // if short is larger than 3, show error message.
            vm.message = {
                'title': 'Short is to long',
                'content': 'Short may not be longer than 3 characters.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // Enables showing a loading indicator.
            vm.dataLoading = true;
            // Send a request to the insert API to add a shiftType.
            Api.shiftType.update(vm.shift).then(function (response) {
                console.log(response.data);
                var result = response.data.result;

                if (!result) {
                    // If name is not unique, show error message
                    vm.message = {
                        'title': 'Name is already taken',
                        'content': '<em>' + vm.shift.short + '</em> is already present in our system, please choose an another name.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successfully updated the shift',
                        'content': '<em>' + vm.shift.short + '</em> is successful updated. return to the <a href="#/manage/shifts">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
                }
            }, function errorCallback(response) {
                vm.message = {
                    'title': response.status + ', ' + response.statusText + '.',
                    'content': 'Please notify the admin regarding this error.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            }).finally(function () {
                vm.dataLoading = false;
            });
        }
    }
}