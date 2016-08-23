var dependencies = [
    "ui.router",
];

function AppRun($rootScope) {
    $rootScope.loading = true;
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
    ;
}

angular.module('app', dependencies)
    .run(AppRun)
    .config(AppConfig);

setTimeout(function () {
    angular.bootstrap(document, ['app']);
}, 10);

