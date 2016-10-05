angular.module('app').controller('LoginController', LoginController);

function LoginController($rootScope, $state, Api, $localStorage, $http) {
    var vm = this;

    $rootScope.loading = false;
    vm.dataLoading = false;
    vm.username = '';
    vm.password = '';
    vm.message = {};
    vm.roleId = null;


    vm.checkLogin = checkLogin;

    function checkLogin() {
        if(!vm.username || !vm.password) {
            vm.message = {
                title: "Login failed",
                content: "Both username and password are required to login. Please try again.",
                type: "alert-danger"
            };
        }
        else {
            vm.dataLoading = true;

            Api.login.check(vm.username, vm.password).then(function (response) {
                var token = response.data.token;

                return Api.users.findLoggedIn().then(function (response) {
                    if(response.data.locked) {
                        vm.dataLoading = false;
                        vm.message = {
                            title: "Locked",
                            content: "Your account is locked. Please contact the admin.",
                            type: "alert-danger"
                        };

                        $http.defaults.headers.common['Authorization'] = null;
                    }
                    else {
                        $localStorage.token = token;
                        $rootScope.user = response.data;
                        $state.go('index');
                    }
                });

            }).catch(function (error) {
                vm.dataLoading = false;
                if(error.status == 401) {
                    vm.message = {
                        title: "Login failed",
                        content: "Either your username or your password is incorrect. Please try again.",
                        type: "alert-danger"
                    };
                }
            });
        }
    }
}