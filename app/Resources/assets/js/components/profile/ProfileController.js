angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($rootScope, Api) {
    var vm = this;
    $rootScope.loading = false;

    vm.measurePassword = measurePassword;
    vm.save = save;

    vm.password = "";
    vm.confirmationPassword = "";

    var progressBar = $(".progress-bar");
    var strength = 0;
    var colors = ["#eb0000", "#FD662E", "#EBBA00", "#68c721", "#00b050"];
    var strengths = ["Very Weak", "Weak", "Better", "Strong", "Very Strong"];

    function measurePassword() {
        console.log(vm.password);

        var result = zxcvbn(vm.password);
        strength = 20 * (result.score + 1);
        console.log(result);

        if (vm.password == '') {
            strength = 0;
        }

        progressBar.css("width", strength + "%");
        progressBar.css("background-color", colors[result.score]);
        vm.strengthText = strengths[result.score];

        if (vm.password == '') {
            vm.strengthText = '';
        }
    }

    function save() {
        if (vm.password.trim() == '' && vm.confirmationPassword.trim() == '') {

            // error if empty
            console.log("Fill in both required fields to change password.");

        } else {
            if (vm.password.trim() == vm.confirmationPassword.trim()) {

                vm.dataLoading = true;


                Api.users.update.password(vm.password).then(function (response) {
                    // $rootScope.user = response.data;

                    vm.message = {
                        title: 'Successfully updated',
                        content: 'Successfully updated your password.',
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