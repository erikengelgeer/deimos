angular.module("app").controller('ResetPasswordController', ResetPasswordController);

function ResetPasswordController($rootScope) {
    var vm = this;

    vm.email = '';

    vm.resetPassword = resetPassword;

    $rootScope.loading = false;

    function resetPassword() {
        // TODO: api call for existing emails with accounts in database.
        if(vm.email.trim() != '')
        {
            console.log("Succes, check your email for a password reset link.");
        }
    }
}