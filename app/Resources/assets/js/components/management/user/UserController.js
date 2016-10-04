/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('UserController', UserController);

function UserController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.selectedRole = selectedRole;
    vm.updateRole = updateRole;

    vm.users = [];
    vm.roles = [];

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

    function selectedRole(userRoleId, roleId) {
        return userRoleId == roleId;
    }

    function updateRole(userRoleId, userId) {
        console.log("role"+userRoleId, "id"+userId);
        a = [userId, userRoleId];
        Api.users.updateRole(a).then(function (response) {
            console.log(response.data);
        })
    }
}