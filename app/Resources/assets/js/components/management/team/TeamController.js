angular.module('app').controller('TeamController', TeamController);

function TeamController($rootScope, Api, $state) {
    var vm = this;

    vm.message = null;
    vm.teams = null;
    vm.selectedTeam = null;
    vm.dataLoading = true;

    vm.showDisableModal = showDisableModal;
    vm.disable = disable;

    if($rootScope.user.role_fk.role.toLowerCase() != 'administrator' && $rootScope.user.role_fk.role.toLowerCase() != 'manager') {
        $state.go('index');
    }

    Api.teams.find().then(function (response) {
        vm.teams = response.data;
        console.log(response);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
        vm.dataLoading = false;
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
                'title': 'Successfully disabled',
                'content': '<em>' + team.name + '</em> is successfully disabled.',
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