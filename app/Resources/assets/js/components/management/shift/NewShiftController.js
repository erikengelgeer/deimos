(function () {
    angular.module('app').controller('NewShiftController', ['$rootScope', 'Api', '$state', '$q', NewShiftController]);

    function NewShiftController($rootScope, Api, $state, $q) {
        var vm = this;
        var promises = [];

        vm.shift = {};
        vm.shift.wholeDay = false;
        vm.team = {};
        vm.colors = ['#b7d66e', '#ffeb3b', '#ffc107', '#EE4A25', '#00b050', '#06AECE', '#999999'];
        vm.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = ['00', '15', '30', '45'];
        vm.breakMinutes = ['00', '15', '30', '45', '60'];

        vm.dataLoading = true;
        vm.message = null;
        vm.selectedColor = null;

        vm.shift.start_time = ['00', '00'];
        vm.shift.end_time = ['00', '00'];
        vm.shift.break_duration = '00';

        vm.add = add;
        vm.selectColor = selectColor;
        vm.toggleWholeDay = toggleWholeDay;

        if ($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
            $state.go('index');
        }

        promises.push(Api.teams.find().then(function (response) {
            vm.team = response.data;
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

        function add() {
            vm.message = null;

            vm.shift.color = vm.selectedColor;

            if (vm.shift.team == null || vm.shift.description == null || vm.shift.short == null || vm.shift.color == null) {
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
                    'title': 'Short is to long',
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
                    // return;

                    // Send a request to the insert API to add a shiftType.
                    Api.shiftType.add(vm.shift).then(function (response) {
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
                                'title': 'Successfully added',
                                'content': '<em>' + vm.shift.short + '</em> is successfully added. Return to the <a href="#/manage/shifts">overview</a>.',
                                'icon': 'fa-check',
                                'type': 'alert-success'
                            }
                            // Resets everything so it can not be send again.
                            vm.shift = null;
                            vm.team = null;
                            vm.shift = {};
                            vm.team = {};
                            vm.shift.start_time = ['00', '00'];
                            vm.shift.end_time = ['00', '00'];
                            vm.shift.break_duration = '00';
                            vm.selectedColor = null;
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

        function toggleWholeDay(shift){
            shift.wholeDay = !shift.wholeDay;
        }

    }
}());