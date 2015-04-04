(function() {
    'use strict';

    pasteApp.constant('routes', {
        routes: [
            {
                name: 'paste',
                url: '/{pasteKey}',
                templateUrl: '/app/paste/paste.html'
            },
            {
                name: 'paste_new',
                url: '/',
                templateUrl: '/app/paste/paste.html'
            }
        ],

        redirects: {
        }
    });
})();