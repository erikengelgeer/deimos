angular.module("app").controller('ResetPasswordController', ResetPasswordController);

function ResetPasswordController($rootScope, Api) {
    var vm = this;

    vm.email = "";
    vm.message = {};

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
            // TODO: api call for existing emails with accounts in database.

            Api.users.passwordRequest(vm.email).then(function (response) {
                console.log(response);
            });

            vm.message = {
                title: "Successful send",
                content: "Success, check your email for a password reset link.",
                type: "alert-success"
            };
        }
        else {
            vm.message = {
                title: "Fields may not be blank",
                content: "Please fill the field.",
                type: "alert-danger"
            };
        }

    }
}