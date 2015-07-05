function main() {
    navigator.geolocation.getCurrentPosition(GetLocation);
}

var organisationConversion = "";
var zoneCounter = 0;
var zone = ["picture", "book", "music", "article", "newspaper"];

function isNotNull(obj) {
    return (obj != null && obj != undefined);
}

function troveRequest(data) {
    console.log(data);

    if (isNotNull(data) && isNotNull(data.response) && isNotNull(data.response.zone) && isNotNull(data.response.zone[0].records)) {
        for (var workIndex = 0; workIndex < data.response.zone[0].records.work.length; workIndex++) {
            var record = data.response.zone[0].records.work[workIndex];

            $("#" + data.response.zone[0].name).append("<div><a href='" + record.troveUrl + "'>" + record.title + "</a></div>");
        }
    }

    zoneCounter = zoneCounter + 1;

    if (zoneCounter < 5) {
        var searchParam = "/api/troveRequest/" + organisationConversion + "/" + zone[zoneCounter];

        setTimeout(function() {
            jQuery.ajax(searchParam).done(troveRequest).fail(troveRequest);
        }, 1000);
    }
}

function loadMap(lat, lon) {
    cartodb.createVis('map', 'http://christomich.cartodb.com/api/v2/viz/db7cb474-22cf-11e5-900d-0e9d821ea90d/viz.json', {
        shareable: true,
        title: true,
        description: true,
        search: true,
        tiles_loader: true,
        center_lat: 0,
        center_lon: 0,
        zoom: 2
    })
        .done(function(vis, layers) {
            // layer 0 is the base layer, layer 1 is cartodb layer
            // setInteraction is disabled by default
            layers[1].setInteraction(true);
            layers[1].on('featureOver', function(e, latlng, pos, data) {
                cartodb.log.log(e, latlng, pos, data);
            });
            // you can get the native map to work with it
            var map = vis.getNativeMap();
            // now, perform any operations you need
            map.setZoom(15);
            map.panTo([lat, lon]);
        })
        .error(function(err) {
            console.log(err);
        });
}

function GetLocation(location) {
    var lat = location.coords.latitude;
    var lon = location.coords.longitude;

    loadMap(lat, lon);

    var sql = new cartodb.SQL({ user: 'christomich' });
    sql.execute("SELECT org FROM ratsib_boundaries ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint({{ lon }},{{ lat }}), 4326) ASC LIMIT 1", { "lat": lat, "lon": lon })
        .done(function(data) {
            zoneCounter = 0;
            organisationConversion = OrganisationConversion[data.rows[0].org];
            var searchParam = "/api/troveRequest/" + organisationConversion + "/" + zone[zoneCounter];

            jQuery.ajax(searchParam).done(troveRequest);
            //console.log(OrganisationConversion[data.rows[0].org]);
        })
        .error(function(errors) {
            // errors contains a list of errors
            console.log("errors:" + errors);
        });

    sql.execute("SELECT title, description, url FROM wamuseumdata ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint({{ lon }},{{ lat }}), 4326) ASC LIMIT 5", { "lat": lat, "lon": lon })
        .done(function(data) {
            for (var rowIndex in data.rows) {
                $("#history").append("<h4><a href='" + data.rows[rowIndex].url + "'>" + data.rows[rowIndex].title + "</a></h4><div>" + data.rows[rowIndex].description + "</div>");
            }
        })
        .error(function(errors) {
            // errors contains a list of errors
            console.log("errors:" + errors);
        });

    sql.execute("SELECT url, primary_image, primary_image_caption FROM abc_local_photo_stories_2009_2014 ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint({{ lon }},{{ lat }}), 4326) ASC LIMIT 5", { "lat": lat, "lon": lon })
        .done(function(data) {
            for (var rowIndex in data.rows) {
                $("#news").append("<div><a href='" + data.rows[rowIndex].url + "' target='_blank'><img src='" + data.rows[rowIndex].primary_image + "' height='100px' /></a></div><div>" + data.rows[rowIndex].primary_image_caption + "</div>");
            }
        })
        .error(function(errors) {
            // errors contains a list of errors
            console.log("errors:" + errors);
        });
}

window.onload = main;