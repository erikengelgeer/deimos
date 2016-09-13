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
        .state('manage-teams',{
            url: "/manage/teams",
            templateUrl: "partials/management/team/index.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('edit-team',{
            url: "/manage/teams/edit",
            templateUrl: "partials/management/team/edit.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('create-team',{
            url: "/manage/teams/new",
            templateUrl: "partials/management/team/new.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-users',{
            url: "/manage/users",
            templateUrl: "partials/management/user/index.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('create-user',{
            url: "/manage/users/new",
            templateUrl: "partials/management/user/new.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('edit-user',{
            url: "/manage/users/edit",
            templateUrl: "partials/management/user/edit.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-shifts',{
            url: "/manage/shifts",
            templateUrl: "partials/management/shift/index.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('create-shift',{
            url: "/manage/shifts/new",
            templateUrl: "partials/management/shift/new.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('edit-shift',{
            url: "/manage/shifts/edit",
            templateUrl: "partials/management/shift/edit.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('manage-tasks',{
            url: "/manage/tasks",
            templateUrl: "partials/management/task/index.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('create-task',{
            url: "/manage/tasks/new",
            templateUrl: "partials/management/task/new.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('edit-task',{
            url: "/manage/tasks/edit",
            templateUrl: "partials/management/task/edit.html",
            controller: "ManagementController",
            controllerAs: "vm"
        })
        .state('plan-shifts',{
            url: "/plan/shifts",
            templateUrl: "partials/planning/shifts.html",
            controller: "PlanningController",
            controllerAs: "vm"
        })
        .state('plan-tasks',{
            url: "/plan/tasks",
            templateUrl: "partials/planning/tasks.html",
            controller: "PlanningController",
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

