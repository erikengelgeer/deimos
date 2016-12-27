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
    vm.selectedTask = null;
    vm.message = null;
    vm.userFilterSelected = false;

    // saves the start and endTime from the editShift function for the toggleWholeDay function
    var saveStartTime;
    var saveEndTime;

    var today = new Date();

    vm.formattedToday = (today.getDate() + 1) + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    // ---
    vm.currentYear = new Date().getFullYear();
    // vm.startDate = new Date(vm.currentYear + '-' + (parseInt(new Date().getMonth()) + 1) + '-1');
    // vm.endDate = new Date(vm.currentYear, (parseInt(new Date().getMonth()) + 1), 0);
    vm.startDate = getMonday(new Date());
    vm.endDate = getSundayIn3Weeks(new Date());


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
    vm.filterUser = filterUser;
    vm.applyUserFilter = applyUserFilter;
    vm.clearUserFilter = clearUserFilter;
    vm.buildScheduleLoop = buildScheduleLoop;
    vm.toggleWholeDayShift = toggleWholeDayShift;
    vm.toggleWholeDayTask = toggleWholeDayTask;
    vm.editTask = editTask;
    vm.updateTaskOnTheFly = updateTaskOnTheFly;
    vm.deletePlannedShift = deletePlannedShift;
    vm.checkForDeleteShift = checkForDeleteShift;

    Api.teams.find().then(function (response) {
        vm.teams = response.data;

        vm.selectedTeam = $rootScope.team;

        // Watch for change in rootScope.team, refresh data if it is changed.
        $rootScope.$watch('team.id', function () {
            loadShiftsByTeam($rootScope.team.id);
        })
    });

    function showModal(shift) {
        vm.info = shift;

        var date = vm.info.date.substr(0, 10);
        date = date.split('-');

        vm.info.formattedDate = date[2] + ' ' + vm.months[parseInt(date[1]) - 1] + ' ' + date[0];

        $('#index-modal').modal('show');
    }

    function hideModal() {
        vm.info = [];
        $('#index-modal').modal('hide');
    }

    function loadShiftsByTeam(teamId) {
        vm.userFilterSelected = false;
        // Makes sure that everything will be cleared
        vm.users = [];
        vm.planning = [];
        vm.planningUsers = [];
        vm.shifts = [];

        $rootScope.loading = true;

        var startDate = vm.startDate.getFullYear() + "-" + (vm.startDate.getMonth() + 1) + "-" + vm.startDate.getDate();
        Api.shifts.findByTeam(teamId, startDate, vm.totalWeeks, $rootScope.team.timezone).then(function (response) {
            vm.shifts = response.data;

            buildSchedule(teamId);
        });
    }

    function loadShiftsByUser(userId, teamId) {

        // Makes sure that everything will be cleared
        vm.users = [];
        vm.planning = [];
        vm.planningUsers = [];
        vm.shifts = [];

        $rootScope.loading = true;

        var startDate = vm.startDate.getFullYear() + "-" + (vm.startDate.getMonth() + 1) + "-" + vm.startDate.getDate();
        Api.shifts.findByTeam(teamId, startDate, vm.totalWeeks, $rootScope.team.timezone, vm.selectedUserTemp, userId).then(function (response) {
            vm.shifts = response.data;

            buildSchedule(teamId);
        });
    }

    function buildSchedule(teamId) {
        buildScheduleStructure();
        buildScheduleContent(teamId);
    }

    function buildScheduleStructure() {
        // Builds the schedule in a 7 days per x weeks structure.
        var today = getMonday(vm.startDate);
        // var date = today.getTime();
        var date = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
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
        if (vm.userFilterSelected) {
            Api.users.findOne(vm.selectedUserTemp.id).then(function (response) {
                vm.users = [response.data];

                buildScheduleLoop()
            });
        }
        else {
            Api.users.findByTeam(teamId).then(function (response) {
                vm.users = response.data;

                buildScheduleLoop()
            });
        }
    }

    function buildScheduleLoop() {
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
    }

    function getMonday(d) {
        d = new Date(d);

        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

        return new Date(d.setDate(diff));
    }

    function getSundayIn3Weeks(d) {
        d = new Date(d);

        var day = d.getDay();
        var diff = d.getDate() - day + (day == 7 ? +6 : 28);

        return new Date(d.setDate(diff));
    }

    function getPlanningContent(day, key, planningKey) {

        // get current date of a planning column
        // console.log(day, key, planningKey)
        var date = new Date(vm.planning[planningKey][key]);
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
        var formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

        var data = {};

        if (formattedDate == vm.formattedToday) {
            data.today = true;
        }

        // Iterate trough shifts to find the right shift per column and user
        for (var i = 0; i < vm.shifts.length; i++) {
            var shiftDate = new Date(vm.shifts[i][0]['date']);
            shiftDate = new Date(Date.UTC(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate(), 0, 0, 0));
            var formattedShiftDate = shiftDate.getDate() + "-" + (shiftDate.getMonth() + 1) + "-" + shiftDate.getFullYear();


            // checks if column user is equal to shift user
            if (vm.shifts[i][0]['userId'] == day.user.id && formattedDate == formattedShiftDate) {
                data.shift = vm.shifts[i][0];
                data.tasks = vm.shifts[i][1];


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

                    if ((nextItem.offset().top - ScheduleContainer.offset().top) <= 0 && current != schedules.length) {
                        current++;

                        item = $('#' + current);
                        schedules.removeClass('active');
                        item.addClass('active');
                    }

                } else {
                    // UP

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
        // vm.startDate = new Date(vm.currentYear + '-' + (parseInt(new Date().getMonth()) + 1) + '-1');
        vm.startDate = getMonday(new Date());
        // vm.endDate = new Date(vm.currentYear, (parseInt(new Date().getMonth()) + 1), 0);
        vm.endDate = getSundayIn3Weeks(new Date());

        // 604800000 = 1 week
        vm.totalWeeks = Math.ceil((vm.endDate - vm.startDate) / 604800000);
        //
        vm.selectedYear = vm.currentYear;
        vm.selectedMonth = vm.months[new Date().getMonth()];

        vm.selectedYearTemp = vm.currentYear;
        vm.selectedMonthTemp = vm.months[new Date().getMonth()];

        loadShiftsByTeam($rootScope.team.id);
    }


    function filterUser(key) {
        vm.selectedUserTemp = vm.users[key];

        $('#filter-user').modal();
    }

    function applyUserFilter() {
        vm.planningUsers.user = vm.selectedUserTemp;
        vm.selectedUser = true;

        if (vm.selectedUserTemp != null) {
            vm.userFilterSelected = true;
            $('#filter-user').modal('hide');
            loadShiftsByUser(vm.selectedUserTemp.id, $rootScope.team.id);
        }

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

    function clearUserFilter() {
        vm.userFilterSelected = false;
        loadShiftsByTeam($rootScope.team.id);
    }

    function editShift(shift) {
        vm.message = null;
        $('#edit-shift-modal').modal();

        vm.selectedShift = angular.copy(shift);

        var date = vm.selectedShift.shift.date.substr(0, 10);
        date = date.split('-');

        vm.selectedShift.formattedDate = date[2] + ' ' + vm.months[parseInt(date[1]) - 1] + ' ' + date[0];

        if (vm.selectedShift.shift.wholeDay == undefined) {
            vm.selectedShift.shift.wholeDay = false;
        }

        // DIRTY FIX YO
        if (vm.selectedShift.shift.startTime.length > 5) {
            vm.selectedShift.shift.startTime = vm.selectedShift.shift.startTime.substring(11, 16);
        }
        // DIRTY FIX YO
        if (vm.selectedShift.shift.endTime.length > 5) {
            vm.selectedShift.shift.endTime = vm.selectedShift.shift.endTime.substring(11, 16);
        }


        saveStartTime = vm.selectedShift.shift.startTime;
        saveEndTime = vm.selectedShift.shift.endTime;

        if (vm.selectedShift.shift.startTime == '00:00' && vm.selectedShift.shift.endTime == '23:59') {
            vm.selectedShift.shift.startTime = '00:00';
            vm.selectedShift.shift.endTime = '00:00';

            vm.selectedShift.shift.wholeDay = !vm.selectedShift.shift.wholeDay;
        }
    }

    function updateShift() {
        vm.message = null;

        // var startDate = (Date.parse('01/01/1970 ' + vm.selectedShift.shift.startTime));
        // var endDate = (Date.parse('01/01/1970 ' + vm.selectedShift.shift.endTime));

        var startTime;
        var endTime;

        if (vm.selectedShift.shift.startTime.length == 4) {
            startTime = vm.selectedShift.shift.startTime.match(/.{1,2}/g);
        } else {
            startTime = vm.selectedShift.shift.startTime.split(':');
        }

        if (vm.selectedShift.shift.endTime.length == 4) {
            endTime = vm.selectedShift.shift.endTime.match(/.{1,2}/g);
        } else {
            endTime = vm.selectedShift.shift.endTime.split(':');
        }

        var startTimeTemp = startTime[0] + ':' + startTime[1];
        var endTimeTemp = endTime[0] + ':' + endTime[1];

        if (vm.selectedShift.shift.wholeDay == false) {
            if (endTime >= startTime && startTime <= endTime) {

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {

                    vm.message = {
                        'title': 'Start time is invalid',
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    };

                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {

                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    };

                } else {
                    vm.dataLoading = true;

                    Api.shifts.update(vm.selectedShift.shift, $rootScope.team.timezone).then(function () {
                        vm.message = {
                            'title': 'Successfully updated',
                            'content': 'The shift has successfully been updated.',
                            'icon': 'fa-check',
                            'type': 'alert-success'
                        };


                        for (var i = 0; i < vm.shifts.length; i++) {
                            if (vm.shifts[i][0].id == vm.selectedShift.shift.id) {
                                vm.shifts[i][0].startTime = startTimeTemp;
                                vm.shifts[i][0].endTime = endTimeTemp;
                                vm.shifts[i][0].home = vm.selectedShift.shift.home;
                                break;
                            }
                        }

                        $('#edit-shift-modal').modal('hide')

                        vm.dataLoading = false;
                    }).finally(function () {
                        vm.dataLoading = false;
                    })
                }

            } else {
                vm.message = {
                    'title': 'Invalid time',
                    'content': 'The end time may not be lower than the start time. Please try again.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            }
        }
        else {
            vm.dataLoading = true;

            Api.shifts.update(vm.selectedShift.shift, $rootScope.team.timezone).then(function () {
                vm.message = {
                    'title': 'Successfully updated',
                    'content': 'The shift has successfully been updated.',
                    'icon': 'fa-check',
                    'type': 'alert-success'
                };


                for (var i = 0; i < vm.shifts.length; i++) {
                    if (vm.shifts[i][0].id == vm.selectedShift.shift.id) {
                        vm.shifts[i][0].startTime = "00:00";
                        vm.shifts[i][0].endTime = "23:59";
                        vm.shifts[i][0].home = vm.selectedShift.shift.home;
                        break;
                    }
                }

                $('#edit-shift-modal').modal('hide')

                vm.dataLoading = false;
            }).finally(function () {
                vm.dataLoading = false;
            })
        }
    }

    function deletePlannedShift() {
        $('#index-modal').modal("hide");

        $('#check-for-delete-modal').modal("show");

        console.log($rootScope.user);
    }

    function checkForDeleteShift() {
        vm.id = parseInt(vm.info.id);

        vm.passwordConfirmation = document.getElementById('deleteShiftPassword').value;

        if (!vm.passwordConfirmation) {
            vm.message = {
                title: "Login failed",
                content: "The password is required to continue. Please try again.",
                type: "alert-danger"
            };
            console.log("Geen wachtwoord ingevoerd.");
        }
        else {
            vm.dataLoading = true;
            console.log(vm.passwordConfirmation);
            // checks the password
            Api.login.checkPassword($rootScope.user.password).then(function (response) {
                var password = response.password;
                console.log(password);

                if(password == vm.passwordConfirmation) {
                    Api.shifts.delete(vm.id).then(function () {
                        vm.message = {
                            'title': 'Successfully deleted',
                            'content': 'The shift has successfully been deleted.',
                            'icon': 'fa-check',
                            'type': 'alert-success'
                        };

                        $('#index-modal').modal('hide')

                        vm.dataLoading = false;
                    }).finally(function () {
                        vm.dataLoading = false;
                    })
                }

            }).catch(function (error) {
                vm.dataLoading = false;
                if (error.status == 401) {
                    vm.message = {
                        title: "Login failed",
                        content: "Your password is incorrect. Please try again.",
                        type: "alert-danger"
                    };
                    console.log("Wachtwoord is incorrect.");
                }
            });
        }
    }

    // toggled home for a shift
    function toggleHome(shift) {
        shift.home = !shift.home;
    }

    // toggle for wholeDay
    function toggleWholeDayShift(shift) {
        shift.wholeDay = !shift.wholeDay;

        // checks if wholeDay = true and then changes the time to 00:00 and 23:59 so that it shows as whole day on the planner
        if (vm.selectedShift.shift.wholeDay == true) {
            vm.selectedShift.shift.startTime = '00:00';
            vm.selectedShift.shift.endTime = '23:59';

            // checks if wholeDay is false and then sets the start time as the saved starTime from when you opened the edit modal.
        } else if (vm.selectedShift.shift.wholeDay == false) {
            vm.selectedShift.shift.startTime = saveStartTime;

            // if saveEndTime equals 23:59 sets it to 00:00 for editing purposes
            if (saveEndTime == '23:59') {
                vm.selectedShift.shift.endTime = '00:00';

                // if end time is not 23:59 then set the end time as the saved endTime from when you opened the edit modal
            } else {
                vm.selectedShift.shift.endTime = saveEndTime;
            }
        }
    }

    function toggleWholeDayTask(task) {
        task.wholeDay = !task.wholeDay;

        // checks if wholeDay = true and then changes the time to 00:00 and 23:59 so that it shows as whole day on the planner
        if (vm.selectedTask.wholeDay == true) {
            vm.selectedTask.startTime = '00:00';
            vm.selectedTask.endTime = '23:59';

            // checks if wholeDay is false and then sets the start time as the saved starTime from when you opened the edit modal.
        } else if (vm.selectedTask.wholeDay == false) {
            vm.selectedTask.startTime = saveStartTime;

            // if saveEndTime equals 23:59 sets it to 00:00 for editing purposes
            if (saveEndTime == '23:59') {
                vm.selectedTask.endTime = '00:00';

                // if end time is not 23:59 then set the end time as the saved endTime from when you opened the edit modal
            } else {
                vm.selectedTask.endTime = saveEndTime;
            }
        }
    }

    //edit task on the fly
    function editTask(task, shift) {
        vm.message = null;
        $('#edit-task-modal').modal();
        vm.selectedTask = angular.copy(task);
        vm.selectedShift = angular.copy(shift);

        if (vm.selectedTask.wholeDay == undefined) {
            vm.selectedTask.wholeDay = false;
        }

        // DIRTY FIX YO
        if (vm.selectedTask.taskStartTime.length > 5) {
            vm.selectedTask.startTime = vm.selectedTask.taskStartTime.substring(11, 16);
        }
        // DIRTY FIX YO
        if (vm.selectedTask.taskEndTime.length > 5) {
            vm.selectedTask.endTime = vm.selectedTask.taskEndTime.substring(11, 16);
        }

        saveStartTime = vm.selectedTask.startTime;
        saveEndTime = vm.selectedTask.endTime;

        if (vm.selectedTask.startTime == '00:00' && vm.selectedTask.endTime == '23:59') {
            vm.selectedTask.startTime = '00:00';
            vm.selectedTask.endTime = '00:00';

            vm.selectedTask.wholeDay = !vm.selectedTask.wholeDay;
        }
    }

    function updateTaskOnTheFly() {
        vm.message = null;

        var startTime;
        var endTime;

        if (vm.selectedTask.startTime.length == 4) {
            startTime = vm.selectedTask.startTime.match(/.{1,2}/g);
        } else {
            startTime = vm.selectedTask.startTime.split(':');
        }

        if (vm.selectedTask.endTime.length == 4) {
            endTime = vm.selectedTask.endTime.match(/.{1,2}/g);
        } else {
            endTime = vm.selectedTask.endTime.split(':');
        }

        if (vm.selectedTask.wholeDay == false) {
            if (endTime >= startTime && startTime <= endTime) {
                // var startTime = new Date(startDate);
                // var endTime = new Date(endDate);

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {

                    vm.message = {
                        'title': 'Start time is invalid',
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes, and the hours should be between 00-23. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    };

                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {

                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes, and the hours should be between 00-23. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    };

                } else {
                    vm.dataLoading = true;

                    Api.tasks.updateOnTheFy(vm.selectedTask, $rootScope.team.timezone).then(function () {
                        vm.message = {
                            'title': 'Successfully updated',
                            'content': 'The task has successfully been updated.',
                            'icon': 'fa-check',
                            'type': 'alert-success'
                        };

                        $('#edit-task-modal').modal('hide')

                        loadShiftsByTeam($rootScope.team.id);

                        vm.dataLoading = false;
                    }).finally(function () {
                        vm.dataLoading = false;
                    })
                }

            } else {
                vm.message = {
                    'title': 'Invalid time',
                    'content': 'The end time may not be lower than the start time. Please try again.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            }
        }
        else {
            vm.dataLoading = true;

            Api.tasks.updateOnTheFy(vm.selectedTask, $rootScope.team.timezone).then(function () {
                vm.message = {
                    'title': 'Successfully updated',
                    'content': 'The task has successfully been updated.',
                    'icon': 'fa-check',
                    'type': 'alert-success'
                };

                $('#edit-task-modal').modal('hide')

                loadShiftsByTeam($rootScope.team.id);

                vm.dataLoading = false;
            }).finally(function () {
                vm.dataLoading = false;
            })
        }
    }
}