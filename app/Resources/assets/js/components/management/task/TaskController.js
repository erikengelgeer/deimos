/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TaskController', TaskController);

function TaskController($rootScope, Api) {
    var vm = this;

    vm.taskTypes = null;
    vm.selectedTaskType = null;

    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    Api.taskTypes.find().then(function (response) {
        vm.taskTypes = response.data;
        console.log(response.data);
    },function errorCallBack(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
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
                'title': 'Successfully disabled',
                'content': '<em>' + taskType.short + '</em> is successful disabled.',
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