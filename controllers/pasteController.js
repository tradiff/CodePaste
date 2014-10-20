// pasteController.js
(function (pasteController) {

    var pasteService = require("../services/pasteService");
    var keyService = require("../services/keyService");

    pasteController.init = function(app) {
        app.get("/api/paste/:pasteKey", function (req, res) {
            var pasteKey = req.params.pasteKey;
            console.log("requesting pasteKey: " + pasteKey);

            pasteService.GetPaste(pasteKey, function(err, data) {
                if (err) {
                    res.send(400, err);
                }
                else {
                    res.set("Content-Type", "application/json");
                    res.send({data: data});
                }
            });
        });

        app.post("/api/paste", function(req, res) {
            var pasteData = req.body.pasteData;
            var pasteKey = keyService.GetKey();
            console.log("creating pasteKey: " + pasteKey);

            pasteService.SavePaste(pasteKey, pasteData, function(err, data) {
                if (err) {
                    res.send(400, err);
                }
                else {
                    res.set("Content-Type", "application/json");
                    res.send({pasteKey: pasteKey});
                }
            });
        });
    };

})(module.exports);