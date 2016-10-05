angular.module('app').directive('menu', menu);

function menu() {

    return {
        restrict: "A",
        templateUrl: "partials/nav.html",
        scope: {},
        controllerAs: 'vm',
        controller: function ($scope, $rootScope, $state, $timeout, $localStorage) {
            var vm = this;

            vm.checkStates = checkStates;
            vm.logout = logout;

            function checkStates() {
                var states = [  'manage-shifts', 'manage-shifts-edit', 'manage-shifts-new',
                                'manage-tasks', 'manage-tasks-edit', 'manage-tasks-new',
                                'manage-users', 'manage-users-edit', 'manage-users-new',
                                'manage-teams', 'manage-teams-edit', 'manage-teams-new',
                                'plan-users', 'plan-tasks'];
                
                for(var i = 0; i < states.length; i++) {
                    result = $state.current.name == states[i];

                    if(result) {
                        break;
                    }
                }
                return result;
            }

            function logout() {
                delete $localStorage.token;
                delete $localStorage.loggedInUser;
                console.log('Trying to log out.');
            }
        }
    }
}
