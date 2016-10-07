angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.taskTypes = [];

    vm.selectedUser = 0;
    vm.activeDates = [];
    vm.selectedShift = {};

    vm.selectUser = selectUser;
    vm.deleteTask = deleteTask;
    vm.addTask = addTask;

    promises.push(Api.users.find().then(function (response) {
        vm.users = response.data;
    }));

    promises.push(Api.taskTypes.find().then(function (response) {
        vm.taskTypes = response.data;
    }))

    $q.all(promises).then(function () {
        console.log("tasks", vm.tasks, vm.users)
    }).finally(function () {
        $rootScope.loading = false;
    });

    function selectUser() {
        console.log(vm.selectedUser);

        Api.shifts.findByUser(vm.selectedUser).then(function (response) {
            vm.activeDates = response.data;
            buildDatepicker();
        })
    }

    function buildDatepicker() {
        var startDate = new Date();
        var datepicker = $('#datetimepicker-2');

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

        //    Datepicker events
        datepicker.datepicker().on('changeDate', function (e) {
            var formattedDate = e.date.getFullYear() + "-" + (e.date.getMonth() + 1) + "-" + e.date.getDate();

            Api.shifts.findByUserAndDate(vm.selectedUser, formattedDate).then(function (response) {
                vm.selectedShift = response.data;

                if (vm.selectedShift == null) {
                    console.log('no shift for user bla at bla');
                }
                console.log(vm.selectedShift);
            })
        });
    }

    function addTask(task) {
        vm.message = null;

        if (task == undefined) {
            console.log("No task");
        } else if (task.startTime == null || task.endTime == null || task.taskType == null) {
            console.log("everything is empty!")
        } else {
            var shiftStartTime = new Date(vm.selectedShift.start_time);
            var shiftEndTime = new Date(vm.selectedShift.end_time);

            shiftStartTime = shiftStartTime.getHours() + ":" + shiftStartTime.getMinutes();
            shiftEndTime = shiftEndTime.getHours() + ":" + shiftEndTime.getMinutes();

            if (task.startTime < shiftStartTime && task.startTime > shiftEndTime) {
                console.log('start time error');
            } else if (task.endTime <= task.startTime && task.endTime > shiftEndTime) {
                console.log('end time error');
            } else {
                var startTime = task.startTime.split(':');
                var endTime = task.endTime.split(':');

                if (startTime[1] % 15 != 0 || startTime[0] < 0 || startTime[0] > 23 || startTime[1] > 59 || startTime[1] < 0) {
                    console.log('startTime format is not right');
                } else if (endTime[1] % 15 != 0 || endTime[0] < 0 || endTime[0] > 23 || endTime[1] > 59 || endTime[1] < 0) {
                    console.log('endTime format is not right');
                } else {
                    console.log('okay!');
                    console.log(task);

                    task.shift = vm.selectedShift;

                    Api.tasks.add(task).then(function (response) {
                        vm.selectedShift.tasks.push(response.data);
                        vm.task = null;

                        // TODO: catch and messages
                        console.log('success');
                    })
                }

            }
        }
    }

    function deleteTask(task) {
        Api.tasks.delete(task.id).then(function (response) {
            console.log('succesful removed');

            _.remove(vm.selectedShift.tasks, function(t) {
                return t.id == task.id;
            });
        })
    }


}