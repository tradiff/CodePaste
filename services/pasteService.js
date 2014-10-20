(function (pasteService) {
    var fs = require('fs');
    var crypto = require('crypto');

    pasteService.GetPaste = function(pasteKey, next) {
        var filename = "data/" + md5(pasteKey);
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                next('error');
            }
            else {
                next(null, data);
            }
        });
    };

    pasteService.SavePaste = function(pasteKey, pasteData, next) {
        var filename = "data/" + md5(pasteKey);

        fs.mkdir("data", '700', function() {
            fs.writeFile(filename, pasteData, 'utf8', function(err) {
                if (err) {
                    next('error');
                }
                else {
                    next(null);
                }
            });
        });
    };

    this.md5 = function(str) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        return md5sum.digest('hex');
    };

})(module.exports);