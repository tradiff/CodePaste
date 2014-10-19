var http = require("http");
var express = require("express");
var app = express();

var server = http.createServer(app);

// set the public static resource folder
app.use('/', express.static(__dirname + "/public"));
app.use('/dist', express.static(__dirname + "/dist"));

server.listen(3000);