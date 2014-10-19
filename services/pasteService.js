// pasteService.js
(function (pasteService) {

	pasteService.GetPaste = function(pasteKey, next) {
		next(null, "woot!");
	};

	pasteService.SavePaste = function(pasteKey, pasteData) {
	};

})(module.exports);