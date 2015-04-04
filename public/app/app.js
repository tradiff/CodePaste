'use strict';


// Declare app level module which depends on filters, and services
var pasteApp = angular.module('pasteApp', ['ui.router', 'cfp.hotkeys', 'ui.ace'])
    .config(
    ['$urlRouterProvider', '$stateProvider', 'routes', '$locationProvider',
    function ($urlRouterProvider, $stateProvider, routes, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.otherwise('/');
        var allRoutes = routes.routes;
        for (var i in allRoutes) {
            var route = allRoutes[i];
            $stateProvider.state(route);
        }
        
        ace.config.set('basePath', '/lib/ace-builds/src-min-noconflict/');

    }]
)
.run(['$rootScope', '$state', '$q', 'routes',
    function ($rootScope, $state, $q, routes) {
        var CheckRedirects = function(currentStateName) {
            var redirects = routes.redirects;
            return redirects[currentStateName];
        };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //apply custom redirects (this replaces $urlRouterProvider.when)
        if (CheckRedirects(toState.name)) {
            event.preventDefault();
            $state.go(CheckRedirects(toState.name), toParams);
        }
    });
}]);

