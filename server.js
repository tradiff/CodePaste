var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var controllers = require("./controllers");

// Map the server side routes
controllers.init(app);

var server = http.createServer(app);

// set the public static resource folder
app.use('/', express.static(__dirname + "/public"));
app.use('/dist', express.static(__dirname + "/dist"));

app.use(function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(7777);