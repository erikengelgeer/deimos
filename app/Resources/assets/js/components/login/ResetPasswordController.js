angular.module("app").controller('ResetPasswordController', ResetPasswordController);

function ResetPasswordController($rootScope, Api) {
    var vm = this;

    vm.email = "";
    vm.message = null;

    vm.resetPassword = resetPassword;

    $rootScope.loading = false;

    function resetPassword() {
        console.log(vm.email);
        if (vm.email == undefined) {
            vm.message = {
                title: "Fields may not be blank",
                content: "Please fill in an existing email.",
                type: "alert-danger"
            };
        } else if (vm.email.trim() != '') {
            Api.users.passwordRequest(vm.email).then(function () {
                vm.message = {
                    title: "Successful send",
                    content: "Success, check your email for a password reset link.",
                    type: "alert-success"
                };

            }).catch(function (error) {
                vm.message = {
                    title: "Error",
                    content: "ERROR",
                    type: "alert-danger"
                };
            });

        }
        else {
            vm.message = {
                title: "Fields may not be blank",
                content: "Please fill in the field.",
                type: "alert-danger"
            };
        }

    }
}