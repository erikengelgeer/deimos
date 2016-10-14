angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q, $state) {
    var vm = this;
    var datepicker = $('#datetimepicker-2');
    var promises = [];

    vm.users = [];
    vm.taskTypes = [];

    vm.activeDates = [];
    vm.selectedUser = null;
    vm.selectedShift = null;
    vm.dataLoading = true;

    vm.selectUser = selectUser;
    vm.deleteTask = deleteTask;
    vm.addTask = addTask;

    if ($rootScope.user.role_fk.role.toLowerCase() == 'agent') {
        $state.go('index');
    }

    vm.message = {
        'title': 'Information',
        'content': 'Select a user to continue.',
        'icon': 'fa-info',
        'type': 'alert-info'
    }

    $rootScope.$watch('team.id', function () {
        vm.dataLoading = true;

        promises.push(Api.users.findByTeam($rootScope.team.id).then(function (response) {
            vm.users = response.data;
            vm.dataLoading = false;
        }));
    });

    promises.push(Api.taskTypes.find().then(function (response) {
        vm.taskTypes = response.data;
    }))

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

    function buildDatepicker() {
        var startDate = new Date();

        datepicker.datepicker({
            multidate: false,
            todayHighlight: true,
            startDate: startDate,
            beforeShowDay: function (date) {
                var d = date;

                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                var formattedDate = year + "-" + month + "-" + day;

                for (var i = 0; i < vm.activeDates.length; i++) {
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