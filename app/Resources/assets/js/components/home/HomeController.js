angular.module('app').controller('HomeController', HomeController);

function HomeController($rootScope, Api) {
    var vm = this;

    vm.users = [];
    vm.planning = [];
    vm.planningUsers = [];
    vm.shifts = [];
    vm.selectedTeam = null;
    vm.getPlanningContent = getPlanningContent;

    vm.selectTeam = selectTeam;


    console.log($rootScope.loading);
    // $rootScope.loading = false;
    // console.log($rootScope.loading);


    Api.getTeams().then(function (response){
        vm.teams = response.data;
        console.log(vm.teams);

        //TODO: Team is hardcoded, needs to be read from logged in user.
        vm.selectedTeam = vm.teams[0];
        loadShiftsByTeam(vm.selectedTeam.id);
    });

    function selectTeam() {
        // console.log(vm.selectedTeam.id);
        refreshData(vm.selectedTeam.id);
    }

    function refreshData(teamId){

        loadShiftsByTeam(teamId);

    }

    function loadShiftsByTeam(teamId) {
        vm.users = [];
        vm.planning = [];
        vm.planningUsers = [];
        vm.shifts = [];
        // console.log(teamId);
        Api.getAllShifts(teamId).then(function (response) {
            vm.shifts = response.data;

            buildSchedule(teamId);
            buildScheduleCss();
            $rootScope.loading = false;
            console.log($rootScope.loading);

        });
    }

    function buildSchedule(teamId) {
        buildScheduleStructure();
        buildScheduleContent(teamId);

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

    function buildScheduleContent(teamId) {
        Api.getUsersByTeam(teamId).then(function (response) {
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

    function buildScheduleCss() {
        setTimeout(function () {



            // NOTE: Call this code after building the DOM, otherwise it won't work
            // TODO: disable heading scrolling when working on other browsers than chrome and firefox (for now)

            //@formatter:off
            // Variables
            // Items
            var ScheduleContainer = $('.schedule-container'),
                schedules = $('.schedule');

            // Measures
            var columns = 8,
                scheduleContainerWidth = 'inherit',
                scheduleContainerHeight = $(window).height() - 95;
//            scheduleContainerHeight = 317;

            var current = 1,
                item = $('#' + current),
                lastScrollTop = 0;
            //@formatter:on

            ScheduleContainer.css({'height': scheduleContainerHeight, 'width': scheduleContainerWidth});
            $(window).resize(function () {
                ScheduleContainer.css({'height': scheduleContainerHeight, 'width': scheduleContainerWidth});
            });

            buildSchedule();

            function buildSchedule() {
                var itemWidth = (100 / columns) + '%';
                var heading = $('.heading');
                var bodyRow = $('.body-row');

                heading.find('.item').css({width: itemWidth});
                heading.find('.item:last-child').css({width: itemWidth + 1});

                bodyRow.find('.item').css({width: itemWidth});
                bodyRow.find('.item:last-child').css({width: itemWidth + 1});
            }

            item.addClass('active');

            ScheduleContainer.scroll(function (e) {
                var currentScrollTop = $(this).scrollTop();
                var nextItem = (current == schedules.length) ? $('#' + (current)) : $('#' + (current + 1));
                var previousItem = (current == 1) ? $('#' + (current)) : $('#' + (current - 1));

                if (currentScrollTop > lastScrollTop) {
                    // DOWN
                    console.log('scroll', $(this).scrollTop(), 'nextItem', (nextItem.offset().top - ScheduleContainer.offset().top));

                    if ((nextItem.offset().top - ScheduleContainer.offset().top) <= 0 && current != schedules.length) {
                        current++;

                        item = $('#' + current);
                        schedules.removeClass('active');
                        item.addClass('active');
                    }

                } else {
                    // UP
                    console.log('scroll', $(this).scrollTop(), 'previousItem', (previousItem.offset().top - ScheduleContainer.offset().top));

                    if ((previousItem.offset().top - ScheduleContainer.offset().top) >= (0 - (item.height() + item.find('.heading').height())) && current != 1) {
                        current--;

                        item = $('#' + current);
                        schedules.removeClass('active');
                        item.addClass('active');
                    }

                }
                item.find('.heading').css('top', ($(this).scrollTop()));
                lastScrollTop = currentScrollTop;
            });
        },4000);
    }

    function deleteSchedule() {

    }
}