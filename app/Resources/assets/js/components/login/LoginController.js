angular.module('app').controller('LoginController', LoginController);

function LoginController($rootScope, $state) {
    var vm = this;

    vm.username = '';
    vm.password = '';
    vm.hasPassword = false;

    vm.checkUser = checkUser;
    vm.login = login;

    $rootScope.loading = false;

    function checkUser() {
        console.log(vm.username);
        if (vm.username.trim() != '') {
            // TODO: make here an api call to check the user's role.
            // TODO: if the user does not exist, return warning/error?
            vm.hasPassword = true;
        }
    }

    function login() {
        if(vm.username != '' && vm.password != '') {
            console.log('login');
        }

    }
}