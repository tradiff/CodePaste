﻿'use strict'; 

pasteApp.controller('PasteController',
    ['$scope', '$log', '$state', '$stateParams', '$location', '$timeout', 'hotkeys', 'smoothScroll', 'PasteService',
    function ($scope, $log, $state, $stateParams, $location, $timeout, hotkeys, smoothScroll, PasteService) {
        var self = this;
        $scope.paste = {};
        $scope.paste.isNew = true;
        $scope.paste.pasteKey = '';
        $scope.paste.pasteFormat = '';
        $scope.paste.pasteContent = '';
        $scope.paste.validLanguage = true;
        $scope.paste.location = $location;
        $scope.paste.taggedLines = [];

        self.Init = function () {
            if ($stateParams.format) {
                $state.go('paste', {'pasteKey': $stateParams.pasteKey + '.' + $stateParams.format});
            }
        
            if ($stateParams.pasteKey) {
                var pasteKeyParts = $stateParams.pasteKey.split('.');
                $scope.paste.pasteKey = pasteKeyParts[0];
                $scope.paste.pasteFormat = pasteKeyParts[1] || '';
            }
            $scope.paste.LoadPaste();

            var taggedLines = $location.hash().split(',');
            for (var i = 0; i < taggedLines.length; i++) {
                var num = parseInt(taggedLines[i]);
                if (!isNaN(num) && num > 0) {
                    $scope.paste.taggedLines.push(num);
                }
            };
            $location.hash($scope.paste.taggedLines.join());
        };
        
        $scope.paste.LoadPaste = function() {
            if ($scope.paste.pasteKey) {
                $scope.paste.isNew = false;
                PasteService.GetPaste($scope.paste.pasteKey)
                .then(function (data) {
                    $scope.paste.pasteData = data;
                    $scope.paste.pasteContent = data.data;
                    $scope.paste.lineCount = data.data.split("\n").length;
                    $timeout(function() {
                        $scope.paste.AutoScroll();
                    });
                });
            }
        };
        
        $scope.paste.AutoScroll = function() {
            var element = document.getElementById('L' + $scope.paste.taggedLines[0]);
            if (element)
                smoothScroll(element, {
                    offset: 100
                });
        };
        
        $scope.paste.SavePaste = function() {
            if ($scope.paste.isNew) {
                PasteService.SavePaste($scope.paste.pasteContent)
                .then(function (data) {
                    $state.go('paste', {'pasteKey': data.pasteKey + '.' + $scope.paste.pasteFormat});
                });
            }
        };
        
        $scope.paste.ClickLineNumber = function(lineNumber) {
            var lineNumIndex = $scope.paste.taggedLines.indexOf(lineNumber);
            if (lineNumIndex> -1) {
                // remove
                $scope.paste.taggedLines.splice(lineNumIndex, 1);
            }
            else {
                // add
                $scope.paste.taggedLines.push(lineNumber);
            }
            // setting hash to empty string reloads the page, so lets avoid that by using '0'
            var newHash = $scope.paste.taggedLines.join() || '0';
            $location.hash(newHash);
        };
        
        $scope.paste.GetNumber = function(num) {
            return new Array(num);
        };
        
        $scope.$watch('paste.pasteFormat', function(newValue, oldValue) {
            if (!$scope.paste.isNew) {
                var extension = '';
                if ($scope.paste.pasteFormat)
                    var extension = '.' + $scope.paste.pasteFormat;
                $state.go('paste', {'pasteKey': $scope.paste.pasteKey + extension});
            }

            if ($scope.paste.pasteFormat == '') {
                $scope.paste.validLanguage = true;
            }
            else {
                $scope.paste.validLanguage = hljs.getLanguage($scope.paste.pasteFormat);
            }
        });

        hotkeys.add({
            combo: 'ctrl+s',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function(event, hotkey) {
                event.preventDefault();
                $scope.paste.SavePaste();
            }
        });

        hotkeys.add({
            combo: 'up up down down left right left right b a enter',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function(event, hotkey) {
                javascript:(function(){javascript:var s=document.createElement('script');s.setAttribute('src','https://nthitz.github.io/turndownforwhatjs/tdfw.js');document.body.appendChild(s);})();
                event.preventDefault();
            }
        });

        self.Init();
    }]
);