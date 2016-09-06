var dependencies = [
    "ui.router",
];

function AppRun($rootScope, $state) {
    $rootScope.loading = true;
    $rootScope.$state = $state;
    // $rootScope.tasks = [
    //     {
    //         startTime:"12:00",
    //         endTime:"13:00",
    //         taskName:"Deimos design"
    //     }
    // ];
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
            url: "/change-password",
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
        .state('profile',{
            url: "/profile",
            templateUrl: "partials/profile/profile.html",
            controller: "ProfileController",
            controllerAs: "vm"
        })
        .state('management',{
            url: "/management",
            templateUrl: "partials/management/management.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-teams',{
            url: "/manage-teams",
            templateUrl: "partials/management/manage-teams.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-users',{
            url: "/manage-users",
            templateUrl: "partials/management/manage-users.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-shifts',{
            url: "/manage-shifts",
            templateUrl: "partials/management/manage-shifts.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-tasks',{
            url: "/manage-tasks",
            templateUrl: "partials/management/manage-tasks.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('create-team',{
            url: "/create-team",
            templateUrl: "partials/management/create/team.html",
            controller: "ManagementController",
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

