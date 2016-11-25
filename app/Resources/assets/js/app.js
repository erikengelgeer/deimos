var dependencies = [
    "ui.router",
    "ngStorage",
    "ngSanitize"
];

function AppRun($rootScope, $state, $localStorage, $http, $q, Api) {
    $rootScope.loading = true;
    $rootScope.$state = $state;

    if ($localStorage.token) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.token;

        var promises = [];

        promises.push(Api.users.findLoggedIn().then(function (response) {
            $rootScope.user = response.data;
        }));

        promises.push(Api.teams.find().then(function (response) {
            $rootScope.teams = response.data;
        }));

        $q.all(promises).then(function () {
            if ($rootScope.user.team_fk.visible) {
                $rootScope.team = $rootScope.user.team_fk;
            } else {
                $rootScope.team = $rootScope.teams[0];
            }

           /* Api.shiftType.findByTeam($rootScope.team.id, $rootScope.team.timezone).then(function (response) {
                $rootScope.shiftTypes = response.data;
            });*/

            var dateToday = new Date();
            var date = dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1) + "-" + dateToday.getDate();

            // watches for changes in team.id
            $rootScope.$watch('team.id', function () {

                // reloads the shiftTypes to show
                Api.shiftType.findByTeam($rootScope.team.id, $rootScope.team.timezone).then(function (response) {
                    $rootScope.shiftTypes = response.data;
                });
            });

        }).catch(function (err) {
            if (err.status == 401) {
                delete $localStorage.token;
                $state.go('login');
            }
        });
    }

    $rootScope.$on('$stateChangeStart', function (e, toState) {
        if (!$localStorage.token && toState.name != 'login' && toState.name != 'reset-password' && toState.name != 'change-password') {
            e.preventDefault();
            $state.go('login');
        } else if ($localStorage.token && toState.name == 'login' && toState.name == 'reset-password' && toState.name == 'change-password') {
            e.preventDefault();
            $state.go('index');
        }
    });
}

function AppConfig($stateProvider, $urlRouterProvider, $compileProvider) {

    // TODO: set to false in production.
    $compileProvider.debugInfoEnabled(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "partials/index.html",
            controller: "HomeController",
            controllerAs: "vm"
        })
        .state('login', {
            url: "/login",
            templateUrl: "partials/login/login.html",
            controller: "LoginController",
            controllerAs: "vm"
        })
        .state('change-password', {
            url: "/change-password/{token}",
            templateUrl: "partials/login/change-password.html",
            controller: "ChangePasswordController",
            controllerAs: "vm"
        })
        .state('reset-password', {
            url: "/reset-password",
            templateUrl: "partials/login/reset-password.html",
            controller: "ResetPasswordController",
            controllerAs: "vm"
        })
        .state('profile', {
            url: "/profile",
            templateUrl: "partials/profile/profile.html",
            controller: "ProfileController",
            controllerAs: "vm"
        })
        .state('manage-teams', {
            url: "/manage/teams",
            templateUrl: "partials/management/team/index.html",
            controller: "TeamController",
            controllerAs: "vm"
        })
        .state('manage-teams-new', {
            url: "/manage/teams/new",
            templateUrl: "partials/management/team/new.html",
            controller: "NewTeamController",
            controllerAs: "vm"
        })
        .state('manage-teams-edit', {
            url: "/manage/teams/edit/{teamId}",
            templateUrl: "partials/management/team/edit.html",
            controller: "EditTeamController",
            controllerAs: "vm"
        })
        .state('manage-users', {
            url: "/manage/users",
            templateUrl: "partials/management/user/index.html",
            controller: "UserController",
            controllerAs: "vm"
        })
        .state('manage-users-new', {
            url: "/manage/users/new",
            templateUrl: "partials/management/user/new.html",
            controller: "NewUserController",
            controllerAs: "vm"
        })
        .state('manage-users-edit', {
            url: "/manage/users/edit/{userId}",
            templateUrl: "partials/management/user/edit.html",
            controller: "EditUserController",
            controllerAs: "vm"
        })
        .state('manage-shifts', {
            url: "/manage/shifts",
            templateUrl: "partials/management/shift/index.html",
            controller: "ShiftController",
            controllerAs: "vm"
        })
        .state('manage-shifts-new', {
            url: "/manage/shifts/new",
            templateUrl: "partials/management/shift/new.html",
            controller: "NewShiftController",
            controllerAs: "vm"
        })
        .state('manage-shifts-edit', {
            url: "/manage/shifts/edit/{shiftTypeId}",
            templateUrl: "partials/management/shift/edit.html",
            controller: "EditShiftController",
            controllerAs: "vm"
        })
        .state('manage-tasks', {
            url: "/manage/tasks",
            templateUrl: "partials/management/task/index.html",
            controller: "TaskController",
            controllerAs: "vm"
        })
        .state('manage-tasks-new', {
            url: "/manage/tasks/new",
            templateUrl: "partials/management/task/new.html",
            controller: "NewTaskController",
            controllerAs: "vm"
        })
        .state('manage-tasks-edit', {
            url: "/manage/tasks/edit/{taskTypeId}",
            templateUrl: "partials/management/task/edit.html",
            controller: "EditTaskController",
            controllerAs: "vm"
        })
        .state('plan-users', {
            url: "/plan/users",
            templateUrl: "partials/planning/users.html",
            controller: "PlanUserController",
            controllerAs: "vm"
        })
        .state('plan-tasks', {
            url: "/plan/tasks",
            templateUrl: "partials/planning/tasks.html",
            controller: "PlanTaskController",
            controllerAs: "vm"
        })
    ;
}

angular.module('app', dependencies)
    .run(AppRun)
    .config(AppConfig);

setTimeout(function () {
    angular.bootstrap(document, ['app']);
}, 10);

