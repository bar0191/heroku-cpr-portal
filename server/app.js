var express = require("express");
var bodyParser = require("body-parser");
var couchbase = require("couchbase");
var path = require("path");
//var config = require("./config.json");

var app = express();


app.use(express.static(path.join(__dirname, "../../client/build")));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports.bucket = (
  new couchbase.Cluster("104.131.10.165:8091")).openBucket("default");


var routes = require("./routes/routes.js")(app);

app.use('/*', express.static(path.join(__dirname, "../../client/build")));

var server = app.listen(3001, function () {
    console.log("Listening on port %s...", server.address().port);
});
