// pasteController.js
(function (pasteController) {

	var pasteService = require("../services/pasteService");
	var keyService = require("../services/keyService");

	pasteController.init = function(app) {
		app.get("/api/paste/:pasteKey", function (req, res) {
			var pasteKey = req.params.pasteKey;

			pasteService.GetPaste(pasteKey, function(err, data) {
				if (err) {
					res.send(400, err);
				}
				else {
					res.set("Content-Type", "application/json");
					res.send(data);
				}
			});
		});

		app.post("/api/paste/", funtion(req, res) {
			var pasteData = req.body.pasteData;
			var pasteKey = keyService.GetKey();

			pasteService.SavePaste(pasteData, function(err, data) {
				if (err) {
					res.send(400, err);
				}
				else {
					res.set("Content-Type", "application/json");
					res.send(data);
				}
			})
		});
	};

})(module.exports);