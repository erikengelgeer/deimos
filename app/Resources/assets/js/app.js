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

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "partials/index.html",
            controller: "HomeController",
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

