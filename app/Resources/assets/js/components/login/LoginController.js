angular.module('app').controller('LoginController', LoginController);

function LoginController($rootScope, $state, Api) {
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
            Api.users.find(null, vm.username).then(function (response) {
                console.log(response.data);
                vm.hasPassword = true;
            });
            // TODO: make here an api call to check the user's role.
            // TODO: if the user does not exist, return warning/error?

        }
    }

    function login() {
        if(vm.username != '' && vm.password != '') {
            console.log('login');
        }

    }
}