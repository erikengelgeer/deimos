/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('EditTeamController', EditTeamController);

function EditTeamController($rootScope, Api, $stateParams) {
    var vm = this;
    var teamId = $stateParams.teamId;

    Api.teams.findOne(teamId).then(function (response) {
        vm.editTeam = response.data;
        console.log(response);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;
    });
}