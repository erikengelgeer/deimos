angular.module('app').controller('LoginController', LoginController);

function LoginController($rootScope, $state, Api, $localStorage, $http, $q) {
    var vm = this;

    $rootScope.loading = false;
    vm.dataLoading = false;
    vm.username = '';
    vm.password = '';
    vm.message = null;
    vm.roleId = null;


    vm.checkLogin = checkLogin;

    function checkLogin() {
        vm.message = null;

        if (!vm.username || !vm.password) {
            vm.message = {
                title: "Login failed",
                content: "Both username and password are required to login. Please try again.",
                type: "alert-danger"
            };
        }
        else {
            vm.dataLoading = true;

            // checks the credentials
            Api.login.check(vm.username, vm.password).then(function (response) {
                var token = response.data.token;

                // calls a api call to find the current logged in user.
                Api.users.findLoggedIn().then(function (response) {
                    if (response.data.locked) {
                        vm.dataLoading = false;
                        vm.message = {
                            title: "Locked",
                            content: "Your account is locked. Please contact the admin.",
                            type: "alert-danger"
                        };

                        // removes the default header authorization
                        $http.defaults.headers.common['Authorization'] = null;
                    }
                    else {
                        $localStorage.token = token;
                        $rootScope.user = response.data;

                        var promises = [];
                        var dateToday = new Date();
                        var date = dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1) + "-" + dateToday.getDate();

                        promises.push(Api.teams.find().then(function (response) {
                            $rootScope.teams = response.data;
                            
                            if ($rootScope.user.team_fk.visible) {
                                $rootScope.team = $rootScope.user.team_fk;
                            } else {
                                $rootScope.team = $rootScope.teams[0];
                            }
                        }));

                        promises.push(Api.shiftType.find().then(function (response) {
                            $rootScope.shiftTypes = response.data;
                        }));

                        promises.push(Api.shifts.findByUserAndDate($rootScope.user.id, date).then(function (response) {
                            $rootScope.dailyShift = response.data;
                        }));

                        $q.all(promises).then(function () {
                            $state.go('index');
                        });
                    }
                });

            }).catch(function (error) {
                vm.dataLoading = false;
                if (error.status == 401) {
                    vm.message = {
                        title: "Login failed",
                        content: "Either your username or your password is incorrect. Please try again.",
                        type: "alert-danger"
                    };
                }
            });
        }
    }
}