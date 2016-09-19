/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TaskController', TaskController);

function TaskController($rootScope, Api) {
    var vm = this;

    Api.taskTypes.find().then(function (response) {
        vm.tasksTypes = response.data;
        console.log(response.data);
    },function errorCallBack(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
    });
}