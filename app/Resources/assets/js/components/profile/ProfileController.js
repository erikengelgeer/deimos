angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

    vm.measurePassword = measurePassword;
    vm.save = save;

    vm.password = "";
    vm.confirmationPassword = "";
    vm.strengthText = '';

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
        if (vm.password.trim() != '' && vm.confirmationPassword.trim() != '') {

            if (vm.password.trim() == vm.confirmationPassword.trim()) {

                var result = zxcvbn(vm.password);

                if (result.score == 0 || result.score == 1) {
                    var message = "are you sure? your password is " + strengths[result.score].toLowerCase() + ", \nyou might want to change your password. \nThe given password can be guessed within " + Math.ceil(result.crack_times_seconds.online_throttling_100_per_hour / 86400) + " day(s).";
                    console.log(message);
                }

            //    maybe api call?

            } else {
                console.log('an another error yay!')
            }
        } else {
            console.log("error");
        }
    }
}