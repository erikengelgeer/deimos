angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.shift = {};
    vm.tasks = [];

    vm.selectedUserId = 0;
    vm.selectedDay = '';


    promises.push(Api.users.find().then(function (response) {
        vm.users = response.data;
    }));

    $q.all(promises).then(function () {
        console.log("tasks", vm.tasks, vm.users)
    }).finally(function () {
        $rootScope.loading = false;
    });

    $(function () {
        var active_dates = [];

        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show')
        });

        $('.dropdown-toggle').dropdown();

        var startDate = new Date();


        // Plan Tasks
        var datepicker2 = $('#datetimepicker-2');
        datepicker2.datepicker({
            multidate: false,
            todayHighlight: true,
            startDate: startDate,
            beforeShowDay: function (date) {
                var d = date;

                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                var formattedDate = day + "/" + month + "/" + year;

                if ($.inArray(formattedDate, active_dates) != -1) {
                    return {
                        classes: 'shift'
                    };
                }
            }
        });

        datepicker2.datepicker().on('changeDate', function (e) {
            vm.selectedDay = e.date;

            console.log(vm.selectedDay);
            loadData();
        });

        function loadData() {
            console.log(vm.selectedDay, vm.selectedUserId);

        //     TODO: validate user and selected date
            Api.shifts.findByUser(vm.selectedUserId).then(function (response) {
                console.log(response);
            })
        }
    });

}