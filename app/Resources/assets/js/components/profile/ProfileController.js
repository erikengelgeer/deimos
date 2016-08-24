angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($rootScope) {
    var vm = this;
    $rootScope.loading = false;

    vm.measurePassword = measurePassword;
//    TODO: code for password strength
    vm.password = "";
    vm.confirmationPassword = "";

    var progressBar = $(".progress-bar");
    var progressText = $(".progress-text");
    var strength = 0;
    var colors = ["#eb0000", "#FD662E", "#EBBA00", "#68c721", "#00b050"];
    var strengths = ["Very Weak", "Weak", "Better", "Strong", "Very Strong"];

//    TODO: revise the code and make changes if needed (convert it to angular)
/*    $("#save").click(function () {
        if(passwordInput.val() != '') {
            var result = zxcvbn(passwordInput.val());

            if(result.score == 0 || result.score == 1) {
                var message = "are you sure? your password is " + strengths[result.score].toLowerCase() + ", \nyou might want to change your password. \nThe given password can be guessed within " + Math.ceil(result.crack_times_seconds.online_throttling_100_per_hour / 86400) + " day(s).";
                alert(message);
            }
        }
    })*/

    function measurePassword() {
        console.log(vm.password);

        var result = zxcvbn(vm.password);
        strength = 20 * (result.score + 1);
        console.log(result);

        if (vm.password == '') {
            strength = 0;
            progressBar.find("span").html(null);
        }

        progressBar.css("width", strength + "%");
        progressBar.css("background-color", colors[result.score]);
        progressText.html("<em>" + strengths[result.score] + "</em>");

        if (vm.password == '') {
            strength = 0;
            progressText.html(null);
        }
    }
}