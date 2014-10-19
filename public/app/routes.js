'use strict';

pasteApp.constant('routes', {
    routes: [
        {
            // todo: remove this
            name: 'old_paste',
            url: '/{pasteKey}/{format}',
            controller: 'PasteController',
            templateUrl: '/app/paste/paste.html'
        },
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