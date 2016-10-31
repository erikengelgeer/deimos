angular.module("app").controller('ResetPasswordController', ResetPasswordController);

function ResetPasswordController($rootScope, Api) {
    var vm = this;

    vm.email = "";
    vm.message = null;
    vm.dataLoading = null;

    vm.resetPassword = resetPassword;

    $rootScope.loading = false;

    document.getElementById("email")
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                resetPassword();
            }
        });

    function resetPassword() {
        vm.message = null;

        if (vm.email == undefined) {
            vm.message = {
                title: "Fields may not be blank",
                content: "Please fill in an existing email.",
                type: "alert-danger"
            };
        } else if (vm.email.trim() != '') {
            vm.dataLoading = true;
            Api.users.passwordRequest(vm.email).then(function () {
                vm.message = {
                    title: "Successfully send",
                    content: "Check your email for a password reset link.",
                    type: "alert-success"
                };

                vm.email = "";

            }).catch(function (error) {
                vm.message = {
                    title: "Error",
                    content: "ERROR",
                    type: "alert-danger"
                };
            }).finally(function () {
                vm.dataLoading = false;
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