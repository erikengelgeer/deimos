/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewShiftController', NewShiftController);

function NewShiftController($rootScope, Api) {
    var vm = this;

    vm.shift = {};
    vm.team = {};
    vm.dataLoading = false;
    vm.message = null;

    vm.add = add;

    Api.teams.find().then(function (response) {
        vm.team = response.data;
    }, function errorCallback(response) {
        vm.message = {
            'title': response.status + ', ' + response.statusText + '.',
            'content': 'Please notify the admin regarding this error.',
            'icon': 'fa-exclamation',
            'type': 'alert-danger'
        }
    }).finally(function () {
        $rootScope.loading = false;
    });

    function add() {
        vm.message = null;
        console.log(vm.shift);
        if(vm.shift.team == null || vm.shift.description == null || vm.shift.short == null || vm.shift.wholeday == null || vm.shift.default_start_time == null || vm.shift.default_start_time == null) {
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
            Api.shiftType.add(vm.shift).then(function (response) {
                var result = response.data.result;

                if (!result) {
                    // If name is not unique, show error message
                    vm.message = {
                        'title': 'Name already taken',
                        'content': '<em>' + vm.shift.short + '</em> is already present in our system, please choose an another name.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successful added',
                        'content': '<em>' + vm.shift.short + '</em> is successful added. return to the <a href="#/manage/shifts">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
                    // Resets team so it can not be send again.
                    vm.shift = null;
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