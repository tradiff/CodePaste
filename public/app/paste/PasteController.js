'use strict'; 

pasteApp.controller('PasteController',
    ['$scope', '$log', '$state', '$stateParams', '$location', '$timeout', 'hotkeys', 'PasteService',
    function ($scope, $log, $state, $stateParams, $location, $timeout, hotkeys, PasteService) {
        var self = this;
        $scope.paste = {};
        $scope.paste.isNew = true;
        $scope.paste.pasteKey = '';
        $scope.paste.mode = undefined;
        $scope.paste.pasteContent = '';
        $scope.paste.location = $location;
        $scope.paste.taggedLines = [];
        $scope.paste.aceEditor = undefined;
        
        $scope.paste.allModes = [
            {key: 'txt', aceKey: 'plain_text', desc: 'plain text'},
            {key: 'html', aceKey: 'html', desc: 'html'},
            {key: 'js', aceKey: 'javascript', desc: 'javascript'},
            {key: 'css', aceKey: 'css', desc: 'css'},
            {key: 'cs', aceKey: 'csharp', desc: 'c#'},
            {key: 'sql', aceKey: 'sql', desc: 'sql'},
        ];


        self.Init = function () {
            var modeKey = '';
            if ($stateParams.pasteKey) {
                var pasteKeyParts = $stateParams.pasteKey.split('.');
                $scope.paste.pasteKey = pasteKeyParts[0];
                modeKey = pasteKeyParts[1];
            }
            else {
                // new paste
                modeKey = 'js';
            }
            CheckMode(modeKey);
            LoadPaste();

            var taggedLines = $location.hash().split(',');
            for (var i = 0; i < taggedLines.length; i++) {
                var num = parseInt(taggedLines[i]);
                if (!isNaN(num) && num > 0) {
                    $scope.paste.taggedLines.push(num);
                }
            };
            $location.hash($scope.paste.taggedLines.join());
        };
        
        function CheckMode(modeKey) {
            var found = $scope.paste.allModes.filter(function(item, index) {
                return item.key === modeKey;
            })[0];

            if (found) {
                $scope.paste.mode = found;
            }
            else {
                // plain text
                $scope.paste.mode = $scope.paste.allModes[0];
            }
        }
        
        function LoadPaste() {
            if ($scope.paste.pasteKey) {
                $scope.paste.isNew = false;
                PasteService.GetPaste($scope.paste.pasteKey)
                .then(function (data) {
                    $scope.paste.pasteData = data;
                    $scope.paste.pasteContent = data.data;
                    $scope.paste.lineCount = data.data.split("\n").length;
                });
            }
        };
        
        $scope.paste.SavePaste = function() {
            if ($scope.paste.isNew) {
                PasteService.SavePaste($scope.paste.pasteContent)
                .then(function (data) {
                    $state.go('paste', {'pasteKey': data.pasteKey + '.' + $scope.paste.mode.key});
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
            UpdateTaggedLines();

            // setting hash to empty string reloads the page, so lets avoid that by using '0'
            var newHash = $scope.paste.taggedLines.join() || '0';
            $timeout(function() {
                $location.hash(newHash);
            });
        };
        
        $scope.$watch('paste.mode', function(newValue, oldValue) {
            if (!$scope.paste.isNew) {
                var extension = '.' + $scope.paste.mode.key;
                $state.go('paste', {'pasteKey': $scope.paste.pasteKey + extension});
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
        
        $scope.paste.AceLoaded = function(_editor) {
            $scope.paste.aceEditor = _editor;
            _editor.setShowPrintMargin(false);
            
            _editor.on("guttermousedown", function(e){
                var target = e.domEvent.target;
                if (target.className.indexOf("ace_gutter-cell") == -1)
                    return;

                var row = e.getDocumentPosition().row;
                $scope.paste.ClickLineNumber(row + 1);
                e.stop();
            });

            UpdateTaggedLines();
            if ($scope.paste.taggedLines.length > 0) {
                $timeout(function() {
                    ScrollToLine($scope.paste.taggedLines[0]);
                }, 100);
            }
        };
        
        function ScrollToLine(line) {
            $scope.paste.aceEditor.resize(true);
            $scope.paste.aceEditor.scrollToLine(line, true, true, function () {});
            $scope.paste.aceEditor.gotoLine(line, 10, true);
        }
        
        function UpdateTaggedLines() {
            var Range = ace.require("ace/range").Range;
            var _session = $scope.paste.aceEditor.getSession();

            // clear markers
            var oldMarkers = _session.getMarkers(false);
            angular.forEach(oldMarkers, function(item, index) {
                if (item.clazz === 'tagged-line') {
                    _session.removeMarker(item.id);
                }
            });
            
            $scope.paste.taggedLines.forEach(function(item, index) {
                _session.addMarker(
                    new Range(item-1, 0, item-1, 200), "tagged-line", "fullLine"
                );
            });
        }

        self.Init();
    }]
);