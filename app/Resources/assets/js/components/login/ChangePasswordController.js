angular.module('app').controller('ChangePasswordController', ChangePasswordController);

function ChangePasswordController($rootScope, $stateParams, Api, $state, $localStorage) {
    var vm = this;

    vm.password = '';
    vm.confirmationPassword = '';
    vm.message = {};
    vm.user = null;

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
        if (vm.password.trim() == '' && vm.confirmationPassword.trim() == '') {

            // error if empty
            console.log("Fill in both required fields to change password.");

        } else {
            if (vm.password.trim() == vm.confirmationPassword.trim()) {

                vm.dataLoading = true;

                vm.user.newPassword = vm.password;

                console.log(vm.user);
                Api.users.passwordReset(vm.user).then(function (response) {

                    Api.login.check(vm.user.username, vm.user.newPassword).then(function (response) {
                        var token = response.data.token;

                        return Api.users.findLoggedIn().then(function (response) {
                            if (response.data.locked) {
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
                    })
                });

            } else {
                console.log('The two required fields do not match, please try again.')
            }
        }
    }
}