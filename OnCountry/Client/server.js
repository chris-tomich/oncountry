var express = require("express");
var bodyParser = require("body-parser");
var serveStatic = require("serve-static");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4000;

app.use("/", serveStatic(__dirname));
app.listen(port);