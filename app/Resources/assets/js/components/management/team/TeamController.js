/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TeamController', TeamController);

function TeamController($rootScope, Api, $state) {
    var vm = this;

    vm.teams = null;
    vm.selectedTeam = null;

    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    Api.teams.find().then(function (response) {
        vm.teams = response.data;
        console.log(response);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
    });

    function showDisableModal(team) {
        vm.selectedTeam = team;
        $('#disable-team-modal').modal('show');
    }

    function disable(team) {
        $('#disable-team-modal').modal('hide');
        team.disableLoading = true;

        Api.teams.disable(team.id).then(function () {
            vm.message = {
                'title': 'Successful disabled',
                'content': '<em>' + team.name + '</em> is successful disabled.',
                'icon': 'fa-check',
                'type': 'alert-success'
            }

            _.remove(vm.teams, function (item) {
                return item.id == team.id;
            })

        }, function errorCallback(response) {
            vm.message = {
                'title': response.status + ', ' + response.statusText + '.',
                'content': 'Please notify the admin regarding this error.',
                'icon': 'fa-exclamation',
                'type': 'alert-danger'
            }
        }).finally(function () {
            team.disableLoading = false;
            vm.selectedTeam = null;
        });
    }

}