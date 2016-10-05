angular.module("app").controller('ResetPasswordController', ResetPasswordController);

function ResetPasswordController($rootScope, Api) {
    var vm = this;

    vm.email = "";

    vm.resetPassword = resetPassword;

    $rootScope.loading = false;

    function resetPassword() {
        console.log(vm.email);
        if (vm.email == undefined) {
            console.log("the given email is not an email");
        } else if (vm.email.trim() != '') {
            // TODO: api call for existing emails with accounts in database.

            Api.users.passwordRequest(vm.email).then(function (response) {
                console.log(response);
            });

            console.log("Succes, check your email for a password reset link.");

        }

    }
}