/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('UserController', UserController);

function UserController($rootScope, Api, $q, $state) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.roles = [];
    vm.selectedUser = null;

    vm.updateRole = updateRole;
    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }


    promises.push(Api.users.find().then(function (response) {
        vm.users = response.data;
        console.log(response);
    }));

    promises.push(Api.roles.find().then(function (response) {
        vm.roles = response.data;
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.users, vm.roles);
    }).finally(function () {
        $rootScope.loading = false;
    });


    function updateRole(user) {
        var newRoleId = user.role_fk.id;

        user.newRole = newRoleId;
        user.dataLoading = true;

        Api.users.updateRole(user).then(function () {
            vm.message = {
                'title': 'Role successful changed',
                'content': 'The role of user: <em>' + user.username + '</em> is successfuly changed.',
                'icon': 'fa-check',
                'type': 'alert-success'
            }
        }).finally(function () {
            user.dataLoading = false;
        })
    }

    function showDisableModal(user) {
        console.log(user);
        vm.selectedUser = user;
        $('#disable-user-modal').modal('show');
    }

    function disable(user) {
        $('#disable-user-modal').modal('hide');
        user.disableLoading = true;

        Api.users.disable(user.id).then(function () {
            vm.message = {
                'title': 'Successful disabled',
                'content': '<em>' + user.username + '</em> is successful disabled.',
                'icon': 'fa-check',
                'type': 'alert-success'
            }

            _.remove(vm.users, function (item) {
                return item.id == user.id;
            })

        }, function errorCallback(response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        }).finally(function () {
            user.disableLoading = false;
            vm.selectedUser = null;
        });
    }
}