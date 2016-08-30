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
    ;
}

angular.module('app', dependencies)
    .run(AppRun)
    .config(AppConfig);

setTimeout(function () {
    angular.bootstrap(document, ['app']);
}, 10);

