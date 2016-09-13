/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TaskController', TaskController);

function TaskController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

}