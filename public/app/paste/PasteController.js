'use strict'; 

pasteApp.controller('PasteController',
    ['$scope', '$log', '$state', '$stateParams', '$location', '$anchorScroll', '$timeout', 'hotkeys', 'PasteService',
    function ($scope, $log, $state, $stateParams, $location, $anchorScroll, $timeout, hotkeys, PasteService) {
        var self = this;
        $scope.paste = {};
        $scope.paste.isNew = true;
        $scope.paste.pasteKey = '';
        $scope.paste.pasteFormat = '';
        $scope.paste.pasteContent = '';
        $scope.paste.location = $location;
        
        self.Init = function () {
            if ($stateParams.format) {
                $state.go('paste', {'pasteKey': $stateParams.pasteKey + '.' + $stateParams.format});
            }
        
            if ($stateParams.pasteKey) {
                var pasteKeyParts = $stateParams.pasteKey.split('.');
                $scope.paste.pasteKey = pasteKeyParts[0];
                $scope.paste.pasteFormat = pasteKeyParts[1] || '';
            }
            $anchorScroll.yOffset = 100;   // always scroll by 100 extra pixels
            $scope.paste.LoadPaste();
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
            $anchorScroll();
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
            var newHash = 'L' + lineNumber;
            if ($location.hash() !== newHash) {
              // set the $location.hash to `newHash` and
              // $anchorScroll will automatically scroll to it
              $location.hash(newHash);
            } else {
              // call $anchorScroll() explicitly,
              // since $location.hash hasn't changed
              $anchorScroll();
            }
        };
        
        $scope.paste.GetNumber = function(num) {
            return new Array(num);
        };
        
        $scope.$watch('paste.pasteFormat', function(newValue, oldValue) {
            if (!$scope.paste.isNew) {
                $state.go('paste', {'pasteKey': $scope.paste.pasteKey + '.' + $scope.paste.pasteFormat});
            }
        });

        hotkeys.add({
            combo: 'ctrl+s',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            callback: function(event, hotkey) {
                $scope.paste.SavePaste();
                event.preventDefault();
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