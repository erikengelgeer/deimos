angular.module('app').directive('menu', menu);

function menu() {
    return {
        restrict: "A",
        templateUrl: "partials/nav.html",
        scope: {},
        controllerAs: 'vm',
        controller: ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', MenuController]
    };
    
    function MenuController ($scope, $rootScope, $state, $timeout, $localStorage) {
        var vm = this;

        vm.setTeam = setTeam;
        vm.logout = logout;
        vm.checkStates = checkStates;

        vm.toggleTeamSelectMenu = toggleTeamSelectMenu;
        vm.selectTeam = selectTeam;
        vm.checkAdmin = checkAdmin;

        vm.selectedTeam = null;
        vm.selectTeamActive = false;
        vm.selectedDate = null;

        function setTeam() {
            $rootScope.team = vm.selectedTeam;
        }

        function checkStates() {
            var states = ['manage-shifts', 'manage-shifts-edit', 'manage-shifts-new',
                'manage-tasks', 'manage-tasks-edit', 'manage-tasks-new',
                'manage-users', 'manage-users-edit', 'manage-users-new',
                'manage-teams', 'manage-teams-edit', 'manage-teams-new',
                'plan-users', 'plan-tasks'];

            for (var i = 0; i < states.length; i++) {
                result = $state.current.name == states[i];

                if (result) {
                    break;
                }
            }
            return result;
        }

        function logout() {
            delete $localStorage.token;
            delete $localStorage.loggedInUser;
        }

        function toggleTeamSelectMenu() {
            vm.selectTeamActive = !vm.selectTeamActive;
        }

        function selectTeam(team) {
            $rootScope.team = team;
            vm.selectTeamActive = false;
        }

        function checkAdmin() {
            if($rootScope.user.role_fk.role.toLowerCase() != 'administrator') {
                return true;
            }
        }
    }
}
