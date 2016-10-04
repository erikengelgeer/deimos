/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditTeamController', EditTeamController);

function EditTeamController($rootScope, Api, $stateParams, $q) {
    var vm = this;
    var teamId = $stateParams.teamId;

    vm.team = null;
    vm.timezones = null;
    vm.dataLoading = false;

    vm.update = update;

    // Make a promise
    var promises = [];

    // Fetch the team with the given team id.
    promises.push(Api.teams.findOne(teamId).then(function (response) {
        vm.team = response.data;
    }));

    // See if we can load timezones before everything (in the app.js) or keep it here
    promises.push(Api.timezones.find().then(function (response) {
        vm.timezones = response.data;
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
    });

    function update() {
        // to be sure the message will not be shown.
        vm.message = null;

        if (vm.team.name == null || vm.team.short == null || vm.team.location == null || vm.team.timezone == null) {
            // if fields is empty, show error message.
            vm.message = {
                'title': 'Fields may not be blank',
                'content': 'Please fill in all the required fields.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else if (vm.team.short.length > 3) {
            // if short is larger than 3, show error message.
            vm.message = {
                'title': 'Short is to long',
                'content': 'Short may not be longer than 3 characters.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        } else {
            // Enables showing a loading indicator.
            vm.dataLoading = true;
            // Send a request to the API to update a team.
            Api.teams.update(vm.team).then(function (response) {
                console.log(response.data);
                var result = response.data.result;

                if (!result) {
                    // If name is not unique, show error message
                    vm.message = {
                        'title': 'Name already taken',
                        'content': '<em>' + vm.team.name + '</em> is already present in our system, please choose an another name.',
                        'icon': 'fa-exclamation',
                        'type': 'alert-danger'
                    }
                } else {
                    // If successful, show success message.
                    vm.message = {
                        'title': 'Successful updated',
                        'content': '<em>' + vm.team.name + '</em> is successful updated. return to the <a href="#/manage/teams">overview</a>.',
                        'icon': 'fa-check',
                        'type': 'alert-success'
                    }
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