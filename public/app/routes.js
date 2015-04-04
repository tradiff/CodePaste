'use strict';

pasteApp.constant('routes', {
    routes: [
        {
            name: 'paste',
            url: '/{pasteKey}',
            controller: 'PasteController',
            templateUrl: '/app/paste/paste.html'
        },
        {
            name: 'paste_new',
            url: '/',
            controller: 'PasteController',
            templateUrl: '/app/paste/paste.html'
        }
    ],

    redirects: {
    }
});