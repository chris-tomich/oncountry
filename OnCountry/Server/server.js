var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var serveStatic = require("serve-static");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4000;

getJSON = function(options, onResult)
{
    console.log("rest::getJSON");

    var req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

var router = express.Router();

router.get("/troveRequest/:searchterms/:zone", function(req,res) {
    var searchterms = req.params.searchterms.replace(/-/g, " ");
    var zone = req.params.zone.replace(/-/g, " ");

    var host = "api.trove.nla.gov.au";
    var path = "/result?q=" + searchterms + "&zone=" + zone + "&encoding=json&n=5&key=5cqtvvgelo5j1smq";

    var options = {
        host: host,
        port: 80,
        path: path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    getJSON(options, function(statusCode, result) {
        return res.json(result);
    });
});

app.use("/api", router);
app.use("/", serveStatic("/usr/local/oncountry/OnCountry/Client"));
app.listen(port);