// index.js

(function (controllers) {
	var pasteController = require("./pasteController");

	controllers.init = function (app) {
		pasteController.init(app);
	};


})(module.exports);