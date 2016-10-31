angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q, $state) {
    var vm = this;
    var datepicker = $('#datetimepicker-2');
    var promises = [];
    var startTime = null;
    var endTime = null;

    vm.users = [];
    vm.taskTypes = [];

    vm.activeDates = [];
    vm.selectedUser = null;
    vm.selectedShift = null;
    vm.dataLoading = true;
    vm.editTask = null;

    vm.showModal = showModal;
    vm.hideModal = hideModal;
    vm.selectUser = selectUser;
    vm.deleteTask = deleteTask;
    vm.addTask = addTask;
    vm.updateTask = updateTask;

    if ($rootScope.user.role_fk.role.toLowerCase() == 'agent') {
        $state.go('index');
    }

    vm.message = {
        'title': 'Information',
        'content': 'Select a user to continue.',
        'icon': 'fa-info',
        'type': 'alert-info'
    };

    // finds all users
    promises.push(Api.users.findByTeam($rootScope.team.id).then(function (response) {
        vm.users = response.data;
    }));

    // watches for a change in the team.id
    $rootScope.$watch('team.id', function () {
        vm.dataLoading = true;

        // when there is a change it reloads the shown data
        Api.users.findByTeam($rootScope.team.id).then(function (response) {
            vm.users = response.data;
        }).finally(function () {
            vm.dataLoading = false;
        })
    });

    promises.push(Api.taskTypes.find().then(function (response) {
        vm.taskTypes = response.data;
    }));

    $q.all(promises).finally(function () {
        $rootScope.loading = false;
        vm.dataLoading = false;
    });

    function selectUser() {
        vm.activeDates = [];
        vm.selectedShift = null;
        vm.message = null;
        vm.dataLoading = true;

        if (datepicker != undefined) {
            datepicker.datepicker('destroy');
        }

        Api.shifts.findByUser(vm.selectedUser).then(function (response) {
            vm.activeDates = response.data;
            if (vm.activeDates.length > 0) {
                buildDatepicker();
            } else {
                vm.message = {
                    'title': 'No shifts',
                    'content': 'The selected user does not have any shifts, please add shifts before assigning tasks.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            }
        }).finally(function () {
            vm.dataLoading = false;
        })
    }

    // TODO: show assigned shifts in the past
    function buildDatepicker() {
        datepicker.datepicker({
            multidate: false,
            todayHighlight: true,
            beforeShowDay: function (date) {
                var d = date;

                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                var formattedDate = year + "-" + month + "-" + day;

                for (var i = 0; i < vm.activeDates.length; i++) {
                    console.log();
                    var activeDate = new Date(vm.activeDates[i].date);
                    var date = activeDate.getFullYear() + "-" + (activeDate.getMonth() + 1) + "-" + activeDate.getDate();

                    if (date == formattedDate) {
                        return {
                            classes: 'shift'
                        };

                        break;
                    }
                }
            }
        });
    }

    function addTask(task) {
        vm.message = null;

        if (task == undefined) {

            vm.message = {
                'title': 'Error',
                'content': 'You can not add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }


        } else if (task.startTime == null || task.endTime == null || task.taskType == null) {
            vm.message = {
                'title': 'All fields are required',
                'content': 'You can not add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            var shiftStartTime = new Date(vm.selectedShift.start_time);
            var shiftEndTime = new Date(vm.selectedShift.end_time);

            shiftStartTime = shiftStartTime.getHours() + ":" + shiftStartTime.getMinutes();
            shiftEndTime = shiftEndTime.getHours() + ":" + shiftEndTime.getMinutes();

            if (Date.parse('01/01/1970 ' + task.startTime) < Date.parse('01/01/1970 ' + shiftStartTime) ||
                Date.parse('01/01/1970 ' + task.startTime) > Date.parse('01/01/1970 ' + shiftEndTime) ||
                Date.parse('01/01/1970 ' + task.endTime) <= Date.parse('01/01/1970 ' + task.startTime) ||
                Date.parse('01/01/1970 ' + task.endTime) > Date.parse('01/01/1970 ' + shiftEndTime)) {

                vm.message = {
                    'title': 'The given times are invalid.',
                    'content': 'The chosen time is invalid, please try again.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }

            } else {
                var startTime = task.startTime.split(':');
                var endTime = task.endTime.split(':');

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {
                    vm.message = {
                        'title': 'Start time is invalid',
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes. please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {
                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes. please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    task.shift = vm.selectedShift;
                    console.log(task);
                    vm.dataLoading = true;
                    Api.tasks.add(task).then(function (response) {
                        vm.selectedShift.tasks.push(response.data);
                        vm.task = null;

                        vm.message = {
                            'title': 'Task added',
                            'content': 'The task is added to the shift',
                            'icon': 'fa-check',
                            'type': 'alert-success'
                        }
                    }).finally(function () {
                        vm.dataLoading = false;
                    })
                }

            }
        }
    }

    function hideModal() {
        vm.editTask = null;
        $('#plan-task-modal').modal('hide');
    }

    function showModal(task) {
        vm.message = null;
        var startHour;
        var startMin;
        var endHour;
        var endMin;
        if(task.start_time.length > 6) {
            startTime = new Date(task.start_time);
            endTime = new Date(task.end_time);

            startHour = startTime.getHours();
            startMin = startTime.getMinutes();

            if(startHour < 10)
            {
                // console.log(hour = "0"+hour);
                startHour = "0" + startHour;
            }

            if(startMin < 10) {
                startMin = "0" + startMin;
            }

            endHour = endTime.getHours();
            endMin = endTime.getMinutes();

            if(endHour < 10)
            {
                // console.log(hour = "0"+hour);
                endHour = "0" + endHour;
            }

            if(endMin < 10) {
                endMin = "0" + endMin;
            }

            startTime = startHour + ":" + startMin;
            endTime = endHour + ":"  + endMin;

            task.start_time = startTime;
            task.end_time = endTime;
        }

        vm.editTask = task;
        $('#plan-task-modal').modal('show');
    }

    function updateTask(task) {

        if (task.start_time == null || task.end_time == null || task.task_type_fk == null) {
            vm.message = {
                'title': 'All fields are required',
                'content': 'You can not add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            var shiftStartTime = new Date(vm.selectedShift.start_time);
            var shiftEndTime = new Date(vm.selectedShift.end_time);

            shiftStartTime = shiftStartTime.getHours() + ":" + shiftStartTime.getMinutes();
            shiftEndTime = shiftEndTime.getHours() + ":" + shiftEndTime.getMinutes();

            if (Date.parse('01/01/1970 ' + task.start_time) < Date.parse('01/01/1970 ' + shiftStartTime) ||
                Date.parse('01/01/1970 ' + task.start_time) > Date.parse('01/01/1970 ' + shiftEndTime) ||
                Date.parse('01/01/1970 ' + task.end_time) <= Date.parse('01/01/1970 ' + task.start_time) ||
                Date.parse('01/01/1970 ' + task.end_time) > Date.parse('01/01/1970 ' + shiftEndTime)) {

                vm.message = {
                    'title': 'The given times are invalid.',
                    'content': 'The chosen time is invalid, please try again.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }

            } else {
                var startTime = task.start_time.split(':');
                var endTime = task.end_time.split(':');

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {
                    vm.message = {
                        'title': 'Start time is invalid',
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes. please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {
                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes. please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    $('#plan-task-modal').modal('hide');
                    vm.dataLoading = true;
                    Api.tasks.update(vm.editTask).then(function () {

                    }).finally(function () {
                        vm.message = {
                            'title': 'Task updated',
                            'content': 'The task is successfully updated',
                            'icon': 'fa-check',
                            'type': 'alert-success'
                        };
                        vm.editTask = null;
                        vm.dataLoading = false;
                    })
                }
            }
        }
    }

    function deleteTask(task) {
        vm.dataLoading = true;
        Api.tasks.delete(task.id).then(function () {
            vm.message = {
                'title': 'Task deleted',
                'content': 'The task is deleted from the shift',
                'icon': 'fa-check',
                'type': 'alert-success'
            }

            _.remove(vm.selectedShift.tasks, function (t) {
                return t.id == task.id;
            });
        }).finally(function () {
            vm.dataLoading = false;
        })
    }

    datepicker.datepicker().on('changeDate', function (e) {
        var formattedDate = e.date.getFullYear() + "-" + (e.date.getMonth() + 1) + "-" + e.date.getDate();

        vm.dataLoading = true;

        Api.shifts.findByUserAndDate(vm.selectedUser, formattedDate).then(function (response) {
            vm.selectedShift = response.data;
            vm.dataLoading = false;
        })
    });


}