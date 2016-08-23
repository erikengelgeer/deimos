var dependencies = [
    "ui.router",
];

function AppRun($rootScope) {
    $rootScope.loading = true;
}

function AppConfig($stateProvider, $urlRouterProvider, $compileProvider) {

    // TODO: set to false in production.
    $compileProvider.debugInfoEnabled(true);
    $urlRouterProvider.otherwise("/");

    // TODO: change this back to index
    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "partials/login/login.html",
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

