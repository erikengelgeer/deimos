/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditTaskController', EditTaskController);

function EditTaskController($rootScope, Api, $stateParams, $q) {
    var vm = this;
    var taskTypeId = $stateParams.taskTypeId;

    vm.taskTypes = [];

    Api.taskTypes.findOne(taskTypeId).then(function (response) {
        vm.editTaskTypes = response.data;
        console.log(response.data);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
    });
}