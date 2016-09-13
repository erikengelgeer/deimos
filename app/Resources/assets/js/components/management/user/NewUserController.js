/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('NewUserController', NewUserController);

function NewUserController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

}