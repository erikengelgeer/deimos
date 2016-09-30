/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('UserController', UserController);

function UserController($rootScope) {
    var vm = this;
    $rootScope.loading = false;
}