/**
 * Created by EAETV on 13/09/2016.
 */
(function () {
    angular.module('app').controller('EditTaskController', EditTaskController, ['$rootScope', 'Api', '$stateParams', '$q', '$state']);

    function EditTaskController($rootScope, Api, $stateParams, $q, $state) {
        var vm = this;
        var taskTypeId = $stateParams.taskTypeId;

        vm.update = update;

        vm.message = null;
        vm.taskType = null;
        vm.dataLoading = true;

        if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
            $state.go('index');
        }

        Api.taskTypes.findOne(taskTypeId).then(function (response) {
            vm.taskType = response.data;
        }, function errorCallback(response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            };
        }).finally(function () {
            $rootScope.loading = false;
            vm.dataLoading = false;
        });

        function update() {
            // to be sure the message will not be shown.
            vm.message = null;

            if (vm.taskType.description == null || vm.taskType.short == null) {
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

                // Send a request to the insert API to add a taskType
                Api.taskTypes.update(vm.taskType).then(function (response) {
                    var result = response.data.result;

                    if(!result) {
                        // If name is not unique, show error message
                        vm.message = {
                            'title': 'Short already taken',
                            'content': '<em>' + vm.taskType.short + '</em> is already present in our system, please choose an another short.',
                            'icon': 'fa-exclamation',
                            'type': 'alert-danger'
                        }
                    } else {
                        // If successful, show success message.
                        vm.message = {
                            'title': 'Successfully updated',
                            'content': '<em>' + vm.taskType.short + '</em> is successful updated. Return to the <a href="#/manage/tasks">overview</a>.',
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
}());