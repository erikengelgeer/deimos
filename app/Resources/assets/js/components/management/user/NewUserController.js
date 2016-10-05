/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewUserController', NewUserController);

function NewUserController($rootScope, Api, $q) {
    var vm = this;

    vm.add = add;

    vm.user = {};

    var promises = [];

    promises.push(Api.teams.find().then(function (response) {
        vm.teams = response.data;
    }));

    promises.push(Api.roles.find().then(function (response) {
        vm.roles = response.data;
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

    function add() {
        vm.message = null;

        if (vm.user.username == null || vm.user.real_name == null || vm.user.email == null || vm.user.role == null || vm.user.team == null) {
            // if fields is empty, show error message.
            vm.message = {
                'title': 'Fields may not be blank',
                'content': 'Please fill in all the required fields.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // Enables showing a loading indicator.
            vm.dataLoading = true;

            Api.users.add(vm.user).then(function (response) {
                var result = response.data.result;

                if (!result) {
                    // If username is not unique, show error message
                    vm.message = {
                        'title': 'username or email is already taken',
                        'content': '<em>' + vm.user.username + '</em> and/or ' + vm.user.email + ' is already present in our system, please choose an another username and/or email.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successful added',
                        'content': '<em>' + vm.user.username + '</em> is successful added. return to the <a href="#/manage/users">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
                    // Resets user so it can not be send again.
                    vm.user = null;
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