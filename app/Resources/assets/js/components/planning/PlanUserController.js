angular.module('app').controller('PlanUserController', PlanUserController);

function PlanUserController($rootScope, Api, $q) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.shiftTypes = [];
    vm.selectedDates = [];
    vm.dataLoading = false;

    vm.checkUser = checkUser;
    vm.addShifts = addShifts;

    // find all users
    promises.push(Api.users.find().then(function (response) {
        vm.users = response.data;
    }));

    // find all shiftTypes
    promises.push(Api.shiftType.find().then(function (response) {
        vm.shiftTypes = response.data;
    }));

    $q.all(promises).then(function () {
    }).finally(function () {
        $rootScope.loading = false;
    });

    // Remove the function
    // $(function () {
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

        vm.selectedDates = selectedDates;
    });
    // });

    // checks is the checkbox is checked
    function checkUser(user) {
        user.checked = !user.checked;
    }

    // checks if all fields are filled in correct and adds a shift
    function addShifts() {
        var data = {
            selectedDates: [],
            shifts: []
        };

        vm.message = null;

        data.selectedDates = vm.selectedDates;

        if (data.selectedDates.length == 0) {

            vm.message = {
                'title': 'No dates selected',
                'content': 'Please select at least one date.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {

            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].checked) {
                    data.shifts.push({
                        userId: vm.users[i].id,
                        shiftId: vm.users[i].newShift
                    });
                }
            }

            if (data.shifts.length == 0) {
                vm.message = {
                    'title': 'No users selected',
                    'content': 'Please select at least one user.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            } else {
                vm.dataLoading = true;

                Api.shifts.add(data).then(function () {

                    vm.message = {
                        'title': 'Selected users are planned',
                        'content': 'The selected users are planned for the selected dates.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    };

                    for (var i = 0; i < vm.users.length; i++) {
                        vm.users[i].checked = false;

                    }

                    // Dirty hax, destroys datepicker and build it up again instead of clearing.
                    datepicker.datepicker('destroy');
                    datepicker.datepicker({
                        multidate: true,
                        todayHighlight: true,
                        startDate: startDate
                    });
                }).finally(function () {
                    vm.dataLoading = false;
                });
            }
        }
    }

}