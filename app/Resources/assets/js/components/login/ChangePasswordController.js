angular.module('app').controller('ChangePasswordController', ChangePasswordController);

function ChangePasswordController($rootScope) {
    var vm = this;

    vm.password = '';
    vm.passwordConfirmation = '';

    vm.changePassword = changePassword;

    $rootScope.loading = false;


    function changePassword() {
        //TODO: check if not empty
        if (vm.password.trim() != '' && vm.passwordConfirmation.trim() != '') {
            if (vm.password.trim() != vm.passwordConfirmation.trim()) {
                console.log("Passwords do not match, try again.");
                return;
            }

            console.log("Success, password has been changed.");
            // TODO: api call to change person's password.

        } else {
            console.log('empty');
        }

    }
}