/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewTaskController', NewTaskController);

function NewTaskController($rootScope, Api) {
    var vm = this;

    vm.taskType = {};
    vm.dataLoading = false;

    vm.add = add;

    $rootScope.loading = false;

    function add() {
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
            Api.taskTypes.add(vm.taskType).then(function (response) {
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
                        'title': 'Successful added',
                        'content': '<em>' + vm.taskType.short + '</em> is successful added. return to the <a href="#/manage/tasks">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
                    // Resets taskType so it can not be send again.
                    vm.taskType = null;
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