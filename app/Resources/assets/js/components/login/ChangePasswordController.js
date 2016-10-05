angular.module('app').controller('ChangePasswordController', ChangePasswordController);

function ChangePasswordController($rootScope, $stateParams, Api) {
    var vm = this;

    vm.password = '';
    vm.confirmationPassword = '';
    vm.validChangeRequest = true;
    vm.message = {};

    vm.changePassword = changePassword;

    Api.users.findByToken($stateParams.token).then(function (response) {
        console.log(response.data.success);

        if(!response.data.success) {
            vm.validChangeRequest = false;
            console.log('No valid token, contact the administrator.');
            vm.message = {
                title: "Unvalid reset token",
                content: "No valid token found, request a valid password request.",
                type: "alert-danger"
            };
        }
    });

    $rootScope.loading = false;



    function changePassword() {
        // //TODO: check if not empty
        // if (vm.password.trim() != '' && vm.passwordConfirmation.trim() != '') {
        //     if (vm.password.trim() != vm.passwordConfirmation.trim()) {
        //         console.log("Passwords do not match, try again.");
        //         return;
        //     }
        //
        //     console.log("Success, password has been changed.");
        //     // TODO: api call to change person's password.
        //
        // } else {
        //     console.log('empty');
        // }

        if (vm.password.trim() == '' && vm.confirmationPassword.trim() == '') {

            // error if empty
            console.log("Fill in both required fields to change password.");

        } else {
            if (vm.password.trim() == vm.confirmationPassword.trim()) {

                vm.dataLoading = true;


                Api.users.passwordReset(vm.password).then(function (response) {
                    // $rootScope.user = response.data;

                    vm.message = {
                        title: 'Successfully reset password',
                        content: 'Your password has been reset.',
                        type: 'alert-success'
                    };

                    vm.password = '';
                    vm.confirmationPassword = '';
                    vm.dataLoading = false;

                    measurePassword();

                });

            } else {
                console.log('The two required fields do not match, please try again.')
            }
        }
    }
}