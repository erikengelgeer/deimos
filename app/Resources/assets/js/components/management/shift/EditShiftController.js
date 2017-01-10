/**
 * Created by EAETV on 13/09/2016.
 */
(function () {
    angular.module('app').controller('EditShiftController', EditShiftController, ['$rootScope', 'Api', '$stateParams', '$q', '$state']);

    function EditShiftController($rootScope, Api, $stateParams, $q, $state) {
        var vm = this;
        var shiftId = $stateParams.shiftTypeId;


        vm.teams = null;
        vm.shift = null;
        vm.colors = ['#b7d66e', '#FFEB3B', '#FFC107', '#EE4A25', '#00B050', '#06AECE', '#999999'];
        vm.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = ['00', '15', '30', '45'];

        vm.breakMinutes = [
            {"minute": "00", "num": 0},
            {"minute": "15", "num": 0.25},
            {"minute": "30", "num": 0.5},
            {"minute": "45", "num": 0.75},
            {"minute": "60", "num": 1}
        ];

        vm.selectedColor = null;
        vm.dataLoading = true;

        vm.update = update;
        vm.selectColor = selectColor;
        vm.toggleWholeDay = toggleWholeDay;

        if ($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
            $state.go('index')
        }

        // Make a promise
        var promises = [];

        // Fetch the team with the given team id.
        promises.push(Api.shiftType.findOne(shiftId).then(function (response) {
            vm.shift = response.data;
            vm.shift.wholeDay = false;

            vm.shift.start_time = vm.shift.default_start_time.split(":");
            vm.shift.start_time[0] = vm.shift.start_time[0].substr(11, 2);

            vm.shift.end_time = vm.shift.default_end_time.split(":");
            vm.shift.end_time[0] = vm.shift.end_time[0].substr(11, 2);

            if (vm.shift.end_time[0] === "23" && vm.shift.end_time[1] === "59") {
                vm.shift.end_time[0] = '00';
                vm.shift.end_time[1] = '00';

                vm.shift.wholeDay = !vm.shift.wholeDay;
            }

            vm.selectedColor = vm.shift.color;
        }));

        // Fetch the team with the given team id.
        promises.push(Api.teams.find().then(function (response) {
            vm.teams = response.data;
        }));

        $q.all(promises).catch(function (response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        }).finally(function () {
            $rootScope.loading = false;
            vm.dataLoading = false;
        });

        function update() {
            vm.message = null;

            vm.shift.color = vm.selectedColor;

            if (vm.shift.team_fk.id == null || vm.shift.description == null || vm.shift.short == null || vm.shift.color == null) {
                // if fields is empty, show error message.
                vm.message = {
                    'title': 'Fields may not be blank',
                    'content': 'Please fill in all required fields.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            } else if (vm.shift.short.length > 3) {
                // if short is larger than 3, show error message.
                vm.message = {
                    'title': 'Short is too long',
                    'content': 'Short may not be longer than 3 characters.',
                    'icon': 'fa-exclamation',
                    'type': 'alert-danger'
                }
            } else {

                vm.shift.default_start_time = vm.shift.start_time[0] + ":" + vm.shift.start_time[1];
                vm.shift.default_end_time = vm.shift.end_time[0] + ":" + vm.shift.end_time[1];

                if (Date.parse('01/01/1970 ' + vm.shift.default_start_time) > Date.parse('01/01/1970 ' + vm.shift.default_end_time) && !vm.shift.wholeDay) {
                    vm.message = {
                        'title': 'Invalid time',
                        'content': 'The end time may not be lower than the start time. Please try again.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // Enables showing a loading indicator.
                    vm.dataLoading = true;
                    // Send a request to the insert API to add a shiftType.
                    Api.shiftType.update(vm.shift).then(function (response) {
                        var result = response.data.result;

                        if (!result) {
                            // If name is not unique, show error message
                            vm.message = {
                                'title': 'Name is already taken',
                                'content': '<em>' + vm.shift.short + '</em> is already present in our system, please choose a different name.',
                                'icon': 'fa-exclamation',
                                'type': 'alert-danger'
                            }
                        } else {
                            // If successful, show success message.
                            vm.message = {
                                'title': 'Successful added',
                                'content': '<em>' + vm.shift.short + '</em> is successfully added. return to the <a href="#/manage/shifts">overview</a>.',
                                'icon': 'fa-check',
                                'type': 'alert-success'
                            }
                            // Resets everything so it can not be send again.
                            /*vm.shift = {};
                             vm.shift.start_time = ['00', '00'];
                             vm.shift.end_time = ['00', '00'];
                             vm.shift.break_duration = '00';
                             vm.selectedColor = null;*/
                        }
                    }, function errorCallback(response) {
                        vm.message = {
                            'title': response.status + ', ' + response.statusText + '.',
                            'content': 'Please notify the admin regarding this error.',
                            'icon': 'fa-exclamation',
                            'type': 'alert-danger'
                        }
                    }).finally(function () {
                        vm.dataLoading = false;
                    });
                }

            }
        }

        function selectColor(color) {
            vm.selectedColor = color;
        }

        // toggle for wholeDay
        function toggleWholeDay(shift) {
            shift.wholeDay = !shift.wholeDay;
        }
    }
}());