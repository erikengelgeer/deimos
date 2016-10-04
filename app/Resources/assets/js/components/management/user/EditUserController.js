/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditUserController', EditUserController);

function EditUserController($rootScope, Api, $stateParams, $q) {
    var vm = this;
    var userId = $stateParams.userId;
    var promises = [];

    vm.updateUser = updateUser;

    vm.users = [];
    vm.roles = [];
    vm.teams = [];

    promises.push(Api.users.findOne(userId).then(function (response) {
        vm.editUser = response.data;
    }));

    promises.push(Api.roles.find().then(function (response) {
        vm.roles = response.data;
    }));

    promises.push(Api.teams.find().then(function (response) {
        vm.teams = response.data;
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.users, vm.roles, vm.teams);
    }).finally(function () {
        $rootScope.loading = false;
    });

    function updateUser() {
        Api.users.update(vm.editUser).then(function (response) {
            console.log(response.data);
        })
    }
}