angular.module('app').controller('ChangePasswordController', ChangePasswordController);

function ChangePasswordController($rootScope, $stateParams, Api, $state, $localStorage) {
    var vm = this;

    vm.password = '';
    vm.confirmationPassword = '';
    vm.message = null;
    vm.user = null;
    vm.dataLoading = false;

    vm.changePassword = changePassword;

    Api.users.findByToken($stateParams.token).then(function (response) {
        if (response.data == null) {
            $state.go('login');
        } else {
            vm.user = response.data;
        }
    }).finally(function () {
        $rootScope.loading = false;
    });

    function changePassword() {
        vm.message = null;

        if (vm.password.trim() == '' || vm.confirmationPassword.trim() == '') {
            // error if empty
            vm.message = {
                title: "Fields may not be blank",
                content: "Fill in both required fields to change password.",
                type: "alert-danger"
            };
        } else {
            if (vm.password.trim() == vm.confirmationPassword.trim()) {

                vm.dataLoading = true;
                vm.user.newPassword = vm.password;

                Api.users.passwordReset(vm.user).then(function () {

                    Api.login.check(vm.user.username, vm.user.newPassword).then(function (response) {
                        var token = response.data.token;

                        // calls a api call to find the current logged in user.
                        return Api.users.findLoggedIn().then(function (response) {
                            if (response.data.locked) {
                                vm.dataLoading = false;
                                vm.message = {
                                    title: "Locked",
                                    content: "Your account is locked. Please contact the admin.",
                                    type: "alert-danger"
                                };

                                // removes the default header authorization
                                // Adds $http to the injections
                                $http.defaults.headers.common['Authorization'] = null;
                            }
                            else {
                                $localStorage.token = token;
                                $rootScope.user = response.data;
                                $state.go('index');
                            }
                        });
                    }).finally(function () {
                        vm.dataLoading = false;
                    });
                });

            } else {
                vm.message = {
                    title: "Fields do not match",
                    content: "The two required fields do not match, please try again.",
                    type: "alert-danger"
                };
            }
        }
    }
}