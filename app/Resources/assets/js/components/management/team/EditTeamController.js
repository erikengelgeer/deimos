/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditTeamController', EditTeamController);

function EditTeamController($rootScope, Api, $stateParams) {
    var vm = this;
    var teamId = $stateParams.teamId;

    vm.updateTeam = updateTeam;

    Api.teams.findOne(teamId).then(function (response) {
        vm.editTeam = response.data;
        console.log(response);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
    });

    function updateTeam() {
        Api.teams.update(vm.editTeam).then(function (response) {
            console.log(response.data);

        //    show some kind of a message
        })
    }
}