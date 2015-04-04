(function () {
    'use strict';

window.pasteApp = angular.module('pasteApp', ['ui.router', 'cfp.hotkeys', 'ui.ace'])
    .config(Config)
    .run(Run);
    
    Config.$inject = ['$urlRouterProvider', '$stateProvider', 'routes', '$locationProvider'];

    function Config($urlRouterProvider, $stateProvider, routes, $locationProvider) {
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
    }

    
    Run.$inject = ['$rootScope', '$state', '$q', 'routes'];
    
    function Run($rootScope, $state, $q, routes) {
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
    }

})();