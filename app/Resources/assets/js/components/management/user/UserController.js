/**
 * Created by EAETV on 13/09/2016.
 */
(function () {
    angular.module('app').controller('UserController', ['$rootScope', 'Api', '$q', '$state', UserController]);

    function UserController($rootScope, Api, $q, $state) {
        var vm = this;
        var promises = [];

        vm.message = null;
        vm.users = [];
        vm.roles = [];
        vm.selectedUser = null;
        vm.dataLoading = true;

        vm.updateRole = updateRole;
        vm.showDisableModal = showDisableModal;
        vm.disable = disable;

        if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
            $state.go('index');
        }

        // finds all users
        promises.push(Api.users.findByTeam($rootScope.team.id, true).then(function (response) {
            vm.users = response.data;
        }));

        // watches for a change in the team.id
        $rootScope.$watch('team.id', function () {
            vm.dataLoading = true;

            // when there is a change it reloads the shown data
            Api.users.findByTeam($rootScope.team.id, true).then(function (response) {
                vm.users = response.data;
            }).finally(function () {
                vm.dataLoading = false;
            })
        });

        promises.push(Api.roles.find().then(function (response) {
            vm.roles = response.data;
        }));

        $q.all(promises).then(function () {
        }).finally(function () {
            $rootScope.loading = false;
            vm.dataLoading = false;
        });


        function updateRole(user) {
            var newRoleId = user.role_fk.id;

            user.newRole = newRoleId;
            user.dataLoading = true;

            Api.users.updateRole(user).then(function () {
                vm.message = {
                    'title': 'Role changed successfully',
                    'content': 'The role of user: <em>' + user.username + '</em> is successfully changed.',
                    'icon': 'fa-check',
                    'type': 'alert-success'
                }
            }).finally(function () {
                user.dataLoading = false;
            })
        }

        function showDisableModal(user) {
            vm.selectedUser = user;
            $('#disable-user-modal').modal('show');
        }

        function disable(user) {
            $('#disable-user-modal').modal('hide');
            user.disableLoading = true;

            Api.users.disable(user.id).then(function () {
                vm.message = {
                    'title': 'Successfully disabled',
                    'content': '<em>' + user.username + '</em> is successfully disabled.',
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
}());