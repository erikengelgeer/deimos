angular.module('app').controller('PlanUserController', PlanUserController);

function PlanUserController($rootScope, Api, $q,$state) {
    var vm = this;
    var promises = [];

    vm.users = [];
    vm.shiftTypes = [];
    vm.selectedDates = [];
    vm.dataLoading = true;

    vm.checkHome = checkHome;
    vm.checkUser = checkUser;
    vm.addShifts = addShifts;

    if($rootScope.user.role_fk.role.toLowerCase() == 'agent') {
        $state.go('index');
    }

    // find all users
    promises.push(Api.users.findByTeam($rootScope.team.id).then(function (response) {
        vm.users = response.data;
    }));

    // watches for a change in the team.id
    $rootScope.$watch('team.id', function () {
        vm.dataLoading = true;

        // when there is a change it reloads the shown data
        Api.users.findByTeam($rootScope.team.id).then(function (response) {
            vm.users = response.data;
        })

        // when there is a change in the team.id, it reloads the shiftypes to show the correct shifts for that team.
        Api.shiftType.findByTeam($rootScope.team.id).then(function (response) {
            vm.shiftTypes = response.data;
        }).finally(function () {
            vm.dataLoading = false;
        })
    });

    // find all shiftTypes
    promises.push(Api.shiftType.findByTeam($rootScope.team.id).then(function (response) {
        vm.shiftTypes = response.data;
    }));

    $q.all(promises).then(function () {
    }).finally(function () {
        $rootScope.loading = false;
        vm.dataLoading = false;
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

    // checks if the checkbox is checked
    function checkUser(user) {
        user.checked = !user.checked;
    }

    // checks if the home is checked
    function checkHome(user) {
        user.home = !user.home;
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
                        shiftId: vm.users[i].newShift,
                        home: (vm.users[i].home == undefined) ? 0 : vm.users[i].home,
                        description: vm.users[i].description
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
                console.log(data);
                Api.shifts.add(data).then(function () {

                    vm.message = {
                        'title': 'Selected users are planned',
                        'content': 'The selected users are planned for the selected dates.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    };

                    for (var i = 0; i < vm.users.length; i++) {
                        vm.users[i].checked = false;
                        vm.users[i].newShift = null;
                        vm.users[i].home = null;
                        vm.users[i].description = null;
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