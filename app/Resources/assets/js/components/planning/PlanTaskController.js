angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q, $state) {
    var vm = this;
    var datepicker = $('#datetimepicker-2');
    var promises = [];
    var startTime = null;
    var endTime = null;

    vm.users = [];
    vm.taskTypes = [];
    vm.message = null;
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
    vm.changeDescription = changeDescription;

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

        Api.shifts.findByUser(vm.selectedUser, $rootScope.team.timezone).then(function (response) {
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
                'content': 'You can\'t add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }

        } else if (task.startTime == null || task.endTime == null || task.taskType == null) {
            vm.message = {
                'title': 'All fields are required',
                'content': 'You can\'t add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else if(task.taskType.override_description == false && task.description != null){
            vm.message = {
                'title': 'This task can\'t have a description',
                'content': 'You can only add a description to a task that can be overridden.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // DIRTY FIX YO
            if (vm.selectedShift.start_time.length > 5) {
                var shiftStartTime = vm.selectedShift.start_time.substring(11, 16);
            }

            // DIRTY FIX YO
            if (vm.selectedShift.end_time.length > 5) {
                var shiftEndTime = vm.selectedShift.end_time.substring(11, 16);
            }

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
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {
                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    task.shift = vm.selectedShift;
                    vm.dataLoading = true;

                    Api.tasks.add(task, $rootScope.team.timezone).then(function (response) {
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
        $('#plan-task-modal').modal();

        vm.selectedTask = angular.copy(task);

        // DIRTY FIX YO
        if (vm.selectedTask.start_time.length > 5) {
            vm.selectedTask.start_time = vm.selectedTask.start_time.substring(11, 16);
        }
        // DIRTY FIX YO
        if (vm.selectedTask.end_time.length > 5) {
            vm.selectedTask.end_time = vm.selectedTask.end_time.substring(11, 16);
        }
    }

    function changeDescription(task) {
        var taskId = angular.copy(task);
        for(var i = 0; i < vm.taskTypes.length; i++){
            if(taskId == vm.taskTypes[i].id){

                vm.selectedTask.task_type_fk.id = vm.taskTypes[i].id;
                vm.selectedTask.task_type_fk.short = vm.taskTypes[i].short;
                vm.selectedTask.task_type_fk.override_description = vm.taskTypes[i].override_description;
                vm.selectedTask.task_type_fk.description = vm.taskTypes[i].description;
                vm.selectedTask.description = vm.taskTypes[i].description;
                break;
            }
        }

    }

    function updateTask(task) {
        if (vm.selectedTask.start_time == null || vm.selectedTask.end_time == null || vm.selectedTask.task_type_fk == null || vm.selectedTask.description == []) {
            vm.message = {
                'title': 'All fields are required',
                'content': 'You can\'t add an empty task to the shift.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {

            // DIRTY FIX YO
            if (vm.selectedShift.start_time.length > 5) {
                var shiftStartTime = vm.selectedShift.start_time.substring(11, 16);
            }

            // DIRTY FIX YO
            if (vm.selectedShift.end_time.length > 5) {
                var shiftEndTime = vm.selectedShift.end_time.substring(11, 16);
            }

            if (Date.parse('01/01/1970 ' + vm.selectedTask.start_time) < Date.parse('01/01/1970 ' + shiftStartTime) ||
                Date.parse('01/01/1970 ' + vm.selectedTask.start_time) > Date.parse('01/01/1970 ' + shiftEndTime) ||
                Date.parse('01/01/1970 ' + vm.selectedTask.end_time) <= Date.parse('01/01/1970 ' + vm.selectedTask.start_time) ||
                Date.parse('01/01/1970 ' + vm.selectedTask.end_time) > Date.parse('01/01/1970 ' + shiftEndTime)) {

                vm.message = {
                    'title': 'The given times are invalid.',
                    'content': 'The chosen time is invalid, please try again.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }

            } else {
                var startTime = vm.selectedTask.start_time.split(':');
                var endTime = vm.selectedTask.end_time.split(':');

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {
                    vm.message = {
                        'title': 'Start time is invalid',
                        'content': 'The chosen start time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {
                    vm.message = {
                        'title': 'End time is invalid',
                        'content': 'The chosen end time is invalid, the time must be set in steps of 15 minutes. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    $('#plan-task-modal').modal('hide');
                    vm.dataLoading = true;
                    Api.tasks.update(vm.selectedTask, $rootScope.team.timezone).then(function (response) {
                        vm.selectedTask.description = response.data.description;

                        for(var i =0; i < vm.selectedShift.tasks.length; i++){
                            if(vm.selectedShift.tasks[i].id == vm.selectedTask.id){
                                vm.selectedShift.tasks[i].start_time = vm.selectedTask.start_time;
                                vm.selectedShift.tasks[i].end_time = vm.selectedTask.end_time;
                                vm.selectedShift.tasks[i].description = vm.selectedTask.description;
                                if(vm.selectedTask.description == 'Other' || vm.selectedTask.description == 'SuperService') {
                                    vm.selectedShift.tasks[i].url = vm.selectedTask.url;
                                } else {
                                    vm.selectedShift.tasks[i].url = null;
                                }

                                break;
                            }
                        }

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

        Api.shifts.findByUserAndDate(vm.selectedUser, formattedDate, $rootScope.team.timezone).then(function (response) {
            vm.selectedShift = response.data;
            vm.dataLoading = false;
        })
    });


}