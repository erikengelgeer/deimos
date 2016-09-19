angular.module('app').controller('PlanTaskController', PlanTaskController);

function PlanTaskController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.tasks = [];
    vm.users = [];

    promises.push(Api.tasks.find().then(function (response) {
        vm.planTasks = response.data;
        console.log(response.data)
    }));

    promises.push(Api.users.find().then(function (response) {
        vm.users = response.data;
        console.log(response.data);
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.planTasks, vm.users)
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
            beforeShowDay: function(date){
                var d = date;

                var day = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();

                var formattedDate = day + "/" + month + "/" + year;

                console.log("days");

                if ($.inArray(formattedDate, active_dates) != -1){
                    return {
                        classes: 'shift'
                    };
                }
                return;
            }
        });
    })
}