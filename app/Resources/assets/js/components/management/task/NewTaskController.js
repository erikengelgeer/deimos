/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewTaskController', NewTaskController);

function NewTaskController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

}