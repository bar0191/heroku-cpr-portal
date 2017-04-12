"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var couchbase = require("couchbase");
var path = require("path");
var config = require("./config");

var app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
} else {
  app.use(express.static(path.join(__dirname, "client/public")));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports.bucket = new couchbase.Cluster(config.couchbase.server).openBucket(config.couchbase.bucket);

var routes = require("./routes/routes.js")(app);

var server = app.listen(3001, function () {
  console.log("Listening on port %s...", server.address().port);
});