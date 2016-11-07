/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TaskController', TaskController);

function TaskController($rootScope, Api, $state) {
    var vm = this;

    vm.message = null;
    vm.taskTypes = null;
    vm.selectedTaskType = null;
    vm.dataLoading = true;

    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }

    Api.taskTypes.find().then(function (response) {
        vm.taskTypes = response.data;
    },function errorCallBack(response) {
    }).finally(function () {
        $rootScope.loading = false;
        vm.dataLoading = false;
    });

    function showDisableModal(taskType) {
        vm.selectedTaskType = taskType;
        $('#disable-tasktype-modal').modal('show');
    }

    function disable(taskType) {
        $('#disable-tasktype-modal').modal('hide');
        taskType.disableLoading = true;

        Api.taskTypes.disable(taskType.id).then(function () {
            vm.message = {
                'title': taskType.short + ' is successfully disabled.',
                'icon': 'fa-check',
                'type': 'alert-success'
            }

            _.remove(vm.taskTypes, function (item) {
                return item.id == taskType.id;
            })

        }, function errorCallback(response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        }).finally(function () {
            taskType.disableLoading = false;
            vm.selectedTaskType = null;
        });
    }
}