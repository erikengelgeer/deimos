angular.module('app').controller('HomeController', HomeController);

function HomeController($rootScope, Api) {
    var vm = this;

    vm.users = [];
    vm.planning = [];
    vm.planningUsers = [];
    vm.shifts = [];

    vm.getPlanningContent = getPlanningContent;

    console.log($rootScope.loading);
    $rootScope.loading = false;
    console.log($rootScope.loading);


    Api.getAllShifts().then(function (response) {
        vm.shifts = response.data;
    });


    buildSchedule();

    function buildSchedule() {
        buildScheduleStructure();
        buildScheduleContent();

        //    load javascript
    }

    function buildScheduleStructure() {
        var today = getMonday(new Date());
        var date = today.getTime();
        var week = [];

        for (var i = 0; i <= 3; i++) {

            for (var j = 0; j <= 7; j++) {
                week.push(new Date(date));
                if (j > 0) {
                    date += 86400 * 1000;
                }
            }

            vm.planning.push(week);
            week = [];
        }

    }

    function buildScheduleContent() {
        Api.getUsers().then(function (response) {
            vm.users = response.data;

            var user = [];
            var week = [];

            for (var w = 0; w <= 3; w++) {

                for (var i = 0; i < vm.users.length; i++) {

                    for (var j = 0; j <= 7; j++) {
                        user.push({
                            day: j,
                            user: vm.users[i]
                        });
                    }

                    week.push(user);
                    user = [];

                }
                vm.planningUsers.push(week);
                week = [];
            }
        });
    }

    function getMonday(d) {
        d = new Date(d);

        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

        return new Date(d.setDate(diff));
    }


    function getPlanningContent(day, key, planningKey) {

        // get current date of a planning column
        var date = new Date(vm.planning[planningKey][key]);
        var formattedDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        var data = [];

        // Iterate trough shifts to find the right shift per column and user
        for(var i = 0; i < vm.shifts.length; i++) {
            var shiftDate = new Date(vm.shifts[i][0]['date']);
            var formattedShiftDate = shiftDate.getDate() + "-" + (shiftDate.getMonth() + 1) + "-" + shiftDate.getFullYear();


            // checks if column user is equal to shift user
            if(vm.shifts[i][0]['userId'] == day.user.id && formattedDate == formattedShiftDate) {
                data = {
                    shift: vm.shifts[i][0],
                    tasks: vm.shifts[i][1]
                };

                // breaks to for to reduce load time
                break;
            }
        }
        

        return data;
    }


}