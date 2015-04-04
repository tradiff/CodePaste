(function() {
    'use strict';

    pasteApp.controller('PasteController', PasteController);

    PasteController.$inject = ['$location', '$log', '$scope', '$state', '$stateParams', '$timeout', 'hotkeys', 'PasteService'];

    function PasteController($location, $log, $scope, $state, $stateParams, $timeout, hotkeys, PasteService) {
        var vm = this;
        vm.isNew = true;
        vm.pasteKey = '';
        vm.mode = undefined;
        vm.pasteContent = '';
        vm.location = $location;
        vm.taggedLines = [];
        vm.aceEditor = undefined;
        
        vm.AceLoaded = AceLoaded;
        vm.SavePaste = SavePaste;
        
        vm.allModes = [
            {key: 'txt', aceKey: 'plain_text', desc: 'plain text'},
            {key: 'html', aceKey: 'html', desc: 'html'},
            {key: 'js', aceKey: 'javascript', desc: 'javascript'},
            {key: 'css', aceKey: 'css', desc: 'css'},
            {key: 'cs', aceKey: 'csharp', desc: 'c#'},
            {key: 'sql', aceKey: 'sql', desc: 'sql'},
        ];

        activate();
        
        ////////////

        function activate() {
            var modeKey = '';
            if ($stateParams.pasteKey) {
                var pasteKeyParts = $stateParams.pasteKey.split('.');
                vm.pasteKey = pasteKeyParts[0];
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
                    vm.taggedLines.push(num);
                }
            };
            $location.hash(vm.taggedLines.join());
            
            SetupWatches();
            SetupHotkeys();
        };
        
        function CheckMode(modeKey) {
            var found = vm.allModes.filter(function(item, index) {
                return item.key === modeKey;
            })[0];

            if (found) {
                vm.mode = found;
            }
            else {
                // plain text
                vm.mode =vm.allModes[0];
            }
        }
        
        function LoadPaste() {
            if (vm.pasteKey) {
                vm.isNew = false;
                PasteService.GetPaste(vm.pasteKey)
                .then(function (data) {
                    vm.pasteData = data;
                    vm.pasteContent = data.data;
                    vm.lineCount = data.data.split("\n").length;
                });
            }
        }
        
        function SavePaste() {
            if (vm.isNew) {
                PasteService.SavePaste(vm.pasteContent)
                .then(function (data) {
                    $state.go('paste', {'pasteKey': data.pasteKey + '.' + vm.mode.key});
                });
            }
        };
        
        function ClickLineNumber(lineNumber) {
            var lineNumIndex = vm.taggedLines.indexOf(lineNumber);
            if (lineNumIndex> -1) {
                // remove
                vm.taggedLines.splice(lineNumIndex, 1);
            }
            else {
                // add
                vm.taggedLines.push(lineNumber);
            }
            UpdateTaggedLines();

            // setting hash to empty string reloads the page, so lets avoid that by using '0'
            var newHash = vm.taggedLines.join() || '0';
            $timeout(function() {
                $location.hash(newHash);
            });
        }
        
        function SetupWatches() {
            $scope.$watch('paste.mode', function(newValue, oldValue) {
                if (!vm.isNew) {
                    var extension = '.' + vm.mode.key;
                    $state.go('paste', {'pasteKey': vm.pasteKey + extension});
                }
            });
        }
        
        function SetupHotkeys() {
            hotkeys.add({
                combo: 'ctrl+s',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    SavePaste();
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
        }
        
        function AceLoaded(_editor) {
            vm.aceEditor = _editor;
            _editor.setShowPrintMargin(false);
            
            _editor.on("guttermousedown", function(e){
                var target = e.domEvent.target;
                if (target.className.indexOf("ace_gutter-cell") == -1)
                    return;

                var row = e.getDocumentPosition().row;
                ClickLineNumber(row + 1);
                e.stop();
            });

            UpdateTaggedLines();
            if (vm.taggedLines.length > 0) {
                $timeout(function() {
                    ScrollToLine(vm.taggedLines[0]);
                }, 100);
            }
        }
        
        function ScrollToLine(line) {
            vm.aceEditor.resize(true);
            vm.aceEditor.scrollToLine(line, true, true, function () {});
            vm.aceEditor.gotoLine(line, 10, true);
        }
        
        function UpdateTaggedLines() {
            var Range = ace.require("ace/range").Range;
            var _session = vm.aceEditor.getSession();

            // clear markers
            var oldMarkers = _session.getMarkers(false);
            angular.forEach(oldMarkers, function(item, index) {
                if (item.clazz === 'tagged-line') {
                    _session.removeMarker(item.id);
                }
            });
            
            vm.taggedLines.forEach(function(item, index) {
                _session.addMarker(
                    new Range(item-1, 0, item-1, 200), "tagged-line", "fullLine"
                );
            });
        }

    }
    
    
})();