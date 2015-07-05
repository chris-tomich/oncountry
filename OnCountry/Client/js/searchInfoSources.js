navigator.geolocation.getCurrentPosition(GetLocation);

function isNotNull(obj) {
    return (obj != null && obj != undefined);
}

function GetLocation(location) {
    var lat = location.coords.latitude;
    var lon = location.coords.longitude;

    var sql = new cartodb.SQL({ user: 'christomich' });
//SELECT TOP(7) cartodb_id FROM ative_title_determination_applications_register ORDER BY the_geom.STDistance(POINT(-121.626 47.8315));
//SELECT * FROM native_title_determination_outcomes WHERE cartodb_id > {{id}}
//sql.execute("SELECT * FROM native_title_determination_outcomes WHERE cartodb_id > {{id}}", { id: 1 }) cartodb_id, name, nthold
    sql.execute("SELECT org FROM ratsib_boundaries ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint({{ lon }},{{ lat }}), 4326) ASC LIMIT 1", { "lat": lat, "lon": lon })
        .done(function(data) {
            var zone = ["picture", "book", "music", "article", "newspaper"];
            for (var i = 0; i < 5; i++) {
                var searchParam = "/api/troveRequest/" + OrganisationConversion[data.rows[0].org] + "/" +zone[i];

                jQuery.ajax(searchParam).done(function(data) {
                    console.log(data);

                    if (isNotNull(data) && isNotNull(data.response) && isNotNull(data.response.zone) && isNotNull(data.response.zone[0].work))

                    for (var workIndex = 0; workIndex < data.response.zone[0].records.work.length; workIndex++) {
                        var record = data.response.zone[0].records.work[workIndex];
                    }
                });
            }
            //console.log(OrganisationConversion[data.rows[0].org]);
        })
        .error(function(errors) {
            // errors contains a list of errors
            console.log("errors:" + errors);
        })
}