angular.module('app').controller('PlanUserController', PlanUserController);

function PlanUserController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.shifts = [];

    promises.push(Api.users.find().then(function (response) {
        vm.planUsers = response.data;
        console.log(response);
    }));

    promises.push(Api.shifts.find().then(function (response) {
        vm.shifts = response.data;
        console.log(response);
    }));

    $q.all(promises).then(function () {
        console.log("done", vm.planUsers, vm.shifts);
    }).finally(function () {
        $rootScope.loading = false;
    });

    $(function () {
        var selectedDates = [];

        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show')
        });

        $('.dropdown-toggle').dropdown();

        var startDate = new Date();

        var datepicker = $('#datetimepicker-1');
        datepicker.datepicker({
            multidate: true,
            todayHighlight: true,
            startDate: startDate
        });

        datepicker.on("changeDate", function (e) {
            var dates = datepicker.datepicker('getFormattedDate');

            if (dates != "") {
                selectedDates = dates.split(",");
            } else {
                selectedDates = [];
            }

            console.log(selectedDates);
        });
    })
}