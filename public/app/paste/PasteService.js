'use strict';

pasteApp.factory('PasteService',
    ['$log', '$http', '$q',
    function ($log, $http, $q) {
        return {
            GetPaste: function (pasteKey) {
                var deferred = $q.defer();
                $http({
                    method: "GET",
                    url: "/api/paste/" + pasteKey
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;            
            },
            
            SavePaste: function (pasteContent) {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: "/api/paste",
                    data: pasteContent
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;            
            }
        };
    }]
);