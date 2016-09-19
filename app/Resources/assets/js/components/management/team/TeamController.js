/**
 * Created by EAETV on 13/09/2016.
 */
angular.module('app').controller('TeamController', TeamController);

function TeamController($rootScope, Api) {
    var vm = this;

    Api.teams.find().then(function (response) {
        vm.teams = response.data;
        console.log(response);
    }, function errorCallback(response) {
        console.log(response);
    }).finally(function () {
        $rootScope.loading = false;

    });

}