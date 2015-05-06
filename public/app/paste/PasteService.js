(function() {
    'use strict';
    pasteApp.factory('PasteService', PasteService);
    
    PasteService.$inject = ['$http', '$log', '$q'];
        function PasteService ($http, $log, $q) {
            
            return {
                GetPaste: GetPaste,
                SavePaste: SavePaste,
                ForkData: undefined
            };
            
            function GetPaste(pasteKey) {
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
            }

            function SavePaste(pasteContent) {
                var deferred = $q.defer();
                $http({
                    method: "POST",
                    url: "/api/paste",
                    data: JSON.stringify({pasteData: pasteContent})
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
                return deferred.promise;            
            }
        }
})();