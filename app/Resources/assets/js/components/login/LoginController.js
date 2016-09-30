angular.module('app').controller('LoginController', LoginController);

function LoginController($rootScope, $state, Api, $scope, $localStorage) {
    var vm = this;

    vm.username = '';
    vm.password = '';
    vm.hasPassword = false;
    vm.userExists = false;
    vm.message = {};
    vm.roleId = null;

    vm.checkUser = checkUser;
    vm.loginWithPassword = loginWithPassword;
    vm.loginWithoutPassword = loginWithoutPassword;

    $rootScope.loading = false;

    function checkUser() {
        console.log(vm.username);
        if (vm.username.trim() != '') {
            // Api.users.find(null, vm.username).then(function (response) {
            //     console.log(response.data);
            // });

            Api.login.checkRole(vm.username).then(function (response) {
                vm.hasPassword = false;
                if (response.data.result == undefined) {
                    console.log('user does not exist');
                    // do something
                    vm.message = {
                        'icon': 'fa fa-times',
                        'title': 'User does not exist',
                        'content': 'The given username could not be found.',
                        'type': 'alert-danger'

                        // TODO: if the user does not exist, return warning/error?
                    }
                } else {

                    console.log(response.data);

                    if(response.data.result) {
                        vm.hasPassword = true;
                    } else {
                    //    do some localstorage shit to know if the user logged in without password
                        vm.userExists = true;
                    }
                    // if (response.data.result != undefined) {
                    //     vm.hasPassword = true;
                    //     console.log(response.data);
                    // }
                }
            });
        }
    }

    function loginWithPassword() {
        if (vm.username != '' && vm.password != '') {
            console.log('Logging in with a password as ' + vm.username + '.');
        }
    }
    
    function loginWithoutPassword() {
        if(vm.username != '' && vm.userExists) {
            // localStorage.setItem('loggedInUser', vm.username);
            $localStorage.loggedInUser = vm.username;
            console.log('Logged in as: ' + $localStorage.loggedInUser);
            $state.go('index');
        }
    }

    // Api.login.check('admin', 'test').then(function (response) {
    //     console.log(response);
    // });


}