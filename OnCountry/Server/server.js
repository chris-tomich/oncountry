var express = require("express");
var bodyParser = require("body-parser");
var serveStatic = require("serve-static");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4000;

var router = express.Router();

router.get("/api/:username/:projectname/:mapname", function(req,res) {
    var username = req.params.username.replace(/-/g, " ");
    var projectname = req.params.projectname.replace(/-/g, " ");
    var mapname = req.params.mapname.replace(/-/g, " ");

    Map.findOne({ "projectname": projectname, "user": username }, function(err, maps) {
        for (var mapIndex in maps.maps) {
            var map = maps.maps[mapIndex];

            if (map.mapname == mapname) {
                return res.json(map);
            }
        }
    });
});

router.get("/:username/:mapname", function(req, res) {
    res.sendFile(mainFile);
});

app.use("/", router);
app.use("/public_files", serveStatic(publicFilesRoot));
app.listen(port);