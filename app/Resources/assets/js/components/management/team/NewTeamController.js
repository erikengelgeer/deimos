/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewTeamController', NewTeamController);

function NewTeamController($rootScope, Api, $state) {
    var vm = this;

    vm.team = {};
    vm.timezones = null;
    vm.dataLoading = true;
    vm.message = null;

    vm.add = add;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }

    // See if we can load timezones before everything (in the app.js) or keep it here
    Api.timezones.find().then(function (response) {
        vm.timezones = response.data;
    }, function errorCallback(response) {
        vm.message = {
            'title': response.status + ', ' + response.statusText + '.',
            'content': 'Please notify the admin regarding this error.',
            'icon': 'fa-exclamation',
            'type': 'alert-danger'
        }
    }).finally(function () {
        $rootScope.loading = false;
        vm.dataLoading = false;
    });


    function add() {
        // to be sure the message will not be shown.
        vm.message = null;
        if (vm.team.name == null || vm.team.short == null || vm.team.location == null || vm.team.timezone == null) {
            // if fields is empty, show error message.
            vm.message = {
                'title': 'Fields may not be blank',
                'content': 'Please fill in all required fields.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else if (vm.team.short.length > 3) {
            // if short is larger than 3, show error message.
            vm.message = {
                'title': 'Short is too long',
                'content': 'Short may not be longer than 3 characters.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // Enables showing a loading indicator.
            vm.dataLoading = true;
            // Send a request to the insert API to add a team.
            Api.teams.add(vm.team).then(function (response) {
                console.log(response.data);
                var result = response.data.result;

                if (!result) {
                    // If name is not unique, show error message
                    vm.message = {
                        'title': 'Name is already taken',
                        'content': '<em>' + vm.team.name + '</em> is already present in our system, please choose a different name.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successfully added',
                        'content': '<em>' + vm.team.name + '</em> is successfully added. Return to the <a href="#/manage/teams">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
                    // Resets team so it can not be send again.
                    vm.team = null;
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