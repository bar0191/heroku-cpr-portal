var uuid = require("uuid");
var db = require("../app").bucket;
var config = require("../config");
var N1qlQuery = require('couchbase').N1qlQuery;

function RecordModel() { };

RecordModel.delete = function(documentId, callback) {
    db.remove(documentId, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: "success", data: result});
    });
};

RecordModel.getAll = function(callback) {
    var statement = "SELECT * " + "FROM `" + '`default`' + "`";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

RecordModel.getLatestMICUId = function(callback) {
    var statement = "select devices from `default` where id like 'CodeBlue_MICU%' order by id desc limit 1";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

RecordModel.getLatestSICUId = function(callback) {
    var statement = "select devices from `default` where id like 'CodeBlue_SICU%' order by id desc limit 1";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

RecordModel.getById = function(data, callback) {
    var statement = "select devices from `default` where id = '"+ data.id +"'";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

RecordModel.getMICUIds = function(callback) {
    var statement = "select id,location,ts from `default` where id like 'CodeBlue_MICU%' order by id asc";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

RecordModel.getSICUIds = function(callback) {
    var statement = "select id,location,ts from `default` where id like 'CodeBlue_SICU%' order by id asc";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = RecordModel;
