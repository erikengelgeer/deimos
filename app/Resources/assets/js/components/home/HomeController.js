angular.module('app').controller('HomeController', HomeController);

function HomeController($rootScope, Api, $timeout) {
    var vm = this;

    vm.users = [];
    vm.planning = [];
    vm.planningUsers = [];
    vm.shifts = [];
    vm.selectedTeam = null;
    vm.info = [];
    vm.selectedShift = null;

    // ---
    vm.currentYear = new Date().getFullYear();
    vm.startDate = new Date(vm.currentYear + '-' + (parseInt(new Date().getMonth()) + 1) + '-1');
    vm.endDate = new Date(vm.currentYear, (parseInt(new Date().getMonth()) + 1), 0);

    // 604800000 = 1 week
    vm.totalWeeks = Math.ceil((vm.endDate - vm.startDate) / 604800000);

    vm.years = [];
    vm.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    vm.selectedYear = vm.currentYear;
    vm.selectedMonth = vm.months[new Date().getMonth()];

    vm.selectedYearTemp = vm.currentYear;
    vm.selectedMonthTemp = vm.months[new Date().getMonth()];

    for (var i = -5; i < 5; i++) {
        vm.years.push(vm.currentYear + i);
    }

    vm.getPlanningContent = getPlanningContent;
    vm.showModal = showModal;
    vm.hideModal = hideModal;
    vm.redirect = redirect;
    vm.filter = filter;
    vm.filterMonth = filterMonth;
    vm.filterYear = filterYear;
    vm.applyFilter = applyFilter;
    vm.filterToday = filterToday;
    vm.editShift = editShift;
    vm.updateShift = updateShift;
    vm.toggleHome = toggleHome;

    Api.teams.find().then(function (response) {
        vm.teams = response.data;

        //TODO: Team is hardcoded, needs to be read from logged in user.
        vm.selectedTeam = $rootScope.team;

        // Watch for change in rootScope.team, refresh data if it is changed.
        $rootScope.$watch('team.id', function () {
            loadShiftsByTeam($rootScope.team.id);
        })
    });

    function showModal(shift) {
        vm.info = shift;
        $('#index-modal').modal('show');
    }

    function hideModal() {
        vm.info = [];
        $('#index-modal').modal('hide');
    }

    function loadShiftsByTeam(teamId) {

        // Makes sure that everything will be cleared
        vm.users = [];
        vm.planning = [];
        vm.planningUsers = [];
        vm.shifts = [];

        $rootScope.loading = true;

        var startDate = vm.startDate.getFullYear() + "-" + (vm.startDate.getMonth() + 1) + "-" + vm.startDate.getDate();
        Api.shifts.findByTeam(teamId, startDate, vm.totalWeeks).then(function (response) {
            vm.shifts = response.data;

            buildSchedule(teamId);
        });
    }

    function buildSchedule(teamId) {
        buildScheduleStructure();
        buildScheduleContent(teamId);
    }

    function buildScheduleStructure() {
        // Builds the schedule in a 7 days per 4 weeks structure.
        var today = getMonday(vm.startDate);
        var date = today.getTime();
        var week = [];

        for (var i = 0; i <= (vm.totalWeeks - 1); i++) {

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
        // Adds content to the schedule, users but not shifts and tasks yet.
        Api.users.findByTeam(teamId).then(function (response) {
            vm.users = response.data;

            var user = [];
            var week = [];

            for (var w = 0; w <= (vm.totalWeeks - 1); w++) {

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

            buildScheduleCss();
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
        var formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        var data = [];

        // Iterate trough shifts to find the right shift per column and user
        for (var i = 0; i < vm.shifts.length; i++) {
            var shiftDate = new Date(vm.shifts[i][0]['date']);
            var formattedShiftDate = shiftDate.getDate() + "-" + (shiftDate.getMonth() + 1) + "-" + shiftDate.getFullYear();


            // checks if column user is equal to shift user
            if (vm.shifts[i][0]['userId'] == day.user.id && formattedDate == formattedShiftDate) {
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
        // NOTE: Call this code after building the DOM, otherwise it won't work
        // TODO: disable heading scrolling when working on other browsers than chrome and firefox (for now)

        $timeout(function () {
            //@formatter:off
            // Variables
            // Items
            var ScheduleContainer = $('.schedule-container'),
                schedules = $('.schedule');

            // Measures
            var columns = 8,
                scheduleContainerWidth = 'inherit',
                scheduleContainerHeight = $(window).height() - 145;

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
                    // console.log('scroll', $(this).scrollTop(), 'nextItem', (nextItem.offset().top - ScheduleContainer.offset().top));

                    if ((nextItem.offset().top - ScheduleContainer.offset().top) <= 0 && current != schedules.length) {
                        current++;

                        item = $('#' + current);
                        schedules.removeClass('active');
                        item.addClass('active');
                    }

                } else {
                    // UP
                    // console.log('scroll', $(this).scrollTop(), 'previousItem', (previousItem.offset().top - ScheduleContainer.offset().top));

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

            // stops loading after everything is built
            $rootScope.loading = false;
        });
    }

    function redirect(taskUrl) {
        console.log(taskUrl);
        if (taskUrl != null && taskUrl != '') {
            window.open(taskUrl, '_blank');
        }
    }

    function filter() {
        vm.selectedMonthTemp = angular.copy(vm.selectedMonth);
        vm.selectedYearTemp = angular.copy(vm.selectedYear);

        $('#filter-modal').modal();
    }

    function filterMonth(key) {
        // to make sure the selected Month won't appear in the filter before applying.
        vm.selectedMonthTemp = vm.months[key];
    }

    function filterYear(year) {
        // to make sure the selected year won't appear in the filter before applying.
        vm.selectedYearTemp = year;
    }

    function filterToday() {
        vm.currentYear = new Date().getFullYear();
        vm.startDate = new Date(vm.currentYear + '-' + (parseInt(new Date().getMonth()) + 1) + '-1');
        vm.endDate = new Date(vm.currentYear, (parseInt(new Date().getMonth()) + 1), 0);

        // 604800000 = 1 week
        vm.totalWeeks = Math.ceil((vm.endDate - vm.startDate) / 604800000);

        vm.selectedYear = vm.currentYear;
        vm.selectedMonth = vm.months[new Date().getMonth()];

        vm.selectedYearTemp = vm.currentYear;
        vm.selectedMonthTemp = vm.months[new Date().getMonth()];

        loadShiftsByTeam($rootScope.team.id);
    }

    function applyFilter() {
        vm.selectedYear = vm.selectedYearTemp;
        vm.selectedMonth = vm.selectedMonthTemp;

        var monthKey = 0;

        for (var i = 0; i < vm.months.length; i++) {
            if (vm.months[i] == vm.selectedMonth) {
                monthKey = i;
                break;
            }
        }

        vm.startDate = new Date(vm.selectedYear + '-' + (monthKey + 1) + '-1');
        vm.endDate = new Date(vm.selectedYear, (monthKey + 1), 0);

        // 604800000 = 1 week
        vm.totalWeeks = Math.ceil((vm.endDate - vm.startDate) / 604800000);

        $('#filter-modal').modal('hide');
        loadShiftsByTeam($rootScope.team.id);
    }

    function editShift(shift) {
        $('#edit-shift-modal').modal();
        vm.selectedShift = shift;

        var startTime = new Date(vm.selectedShift.shift.startTime);
        var startTimeHours = (startTime.getHours() <= 9) ? "0" + startTime.getHours() : startTime.getHours();
        var startTimeMinutes = (startTime.getMinutes() <= 9) ? "0" + startTime.getMinutes() : startTime.getMinutes();
        vm.selectedShift.shift.newStartTime = startTimeHours + ":" + startTimeMinutes;

        var endTime = new Date(vm.selectedShift.shift.endTime);
        var endTimeHours = (endTime.getHours() <= 9) ? "0" + endTime.getHours() : endTime.getHours();
        var endTimeMinutes = (endTime.getMinutes() <= 9) ? "0" + endTime.getMinutes() : endTime.getMinutes();
        vm.selectedShift.shift.newEndTime = endTimeHours + ":" + endTimeMinutes;


        console.log(vm.selectedShift)
    }

    function updateShift() {
        console.log(vm.selectedShift);

        vm.selectedShift.shift.startTime = Date.parse('01/01/1970 ' + vm.selectedShift.shift.newStartTime);
        vm.selectedShift.shift.endTime = Date.parse('01/01/1970 ' + vm.selectedShift.shift.newEndTime);

        if (vm.selectedShift.shift.endTime >= vm.selectedShift.shift.startTime &&
            vm.selectedShift.shift.startTime <= vm.selectedShift.shift.endTime) {
            console.log(vm.selectedShift.shift);
            Api.shifts.update(vm.selectedShift.shift).then(function (response) {
                console.log(response);
            })
        } else {
            // message error something
            console.log('error');
        }
    }

    // toggled home for a shift
    function toggleHome(shift) {
        shift.home = !shift.home;
    }
}