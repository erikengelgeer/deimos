angular.module('app').controller('EditUserController', EditUserController);

function EditUserController($rootScope, Api, $stateParams, $q, $state) {
    var vm = this;
    var userId = $stateParams.userId;
    var promises = [];

    vm.update = update;

    vm.user = null;
    vm.roles = null;
    vm.teams = null;
    vm.dataLoading = true;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }

    promises.push(Api.users.findOne(userId).then(function (response) {
        vm.user = response.data;
        //this takes the email and removes the last nine characters which will always be @agfa.com
        vm.user.email = vm.user.email.substr(0, vm.user.email.length -9);
    }));

    promises.push(Api.roles.find().then(function (response) {
        vm.roles = response.data;
    }));

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
        vm.dataLoading = false;
    });

    function update() {
        // console.log('triggered');
        vm.message = null;

        if (vm.user.username == null || vm.user.real_name == null || vm.user.email == null || vm.user.role_fk == null || vm.user.team_fk == null) {
            // if fields is empty, show error message.
            vm.message = {
                'title': 'Fields may not be blank',
                'content': 'Please fill in all required fields.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // Enables showing a loading indicator.
            vm.dataLoading = true;

            var newRoleId = vm.user.role_fk.id;
            var newTeamId = vm.user.team_fk.id;

            vm.user.newRole = newRoleId;
            vm.user.newTeam = newTeamId;

            Api.users.update.update(vm.user).then(function (response) {
                var result = response.data.result;

                if (!result) {
                    // If username is not unique, show error message
                    vm.message = {
                        'title': 'Username or email is already taken',
                        'content': '<em>' + vm.user.username + '</em> and/or ' + vm.user.email + ' is already present in our system, please choose a different username and/or email.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successfully updated',
                        'content': '<em>' + vm.user.username + '</em> is successfully updated. Return to the <a href="#/manage/users">overview</a>.',
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