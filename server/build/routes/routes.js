"use strict";

var RecordModel = require("../models/recordmodel");

var appRouter = function appRouter(app) {

    app.post("/api/delete", function (req, res) {
        if (!req.body.document_id) {
            return res.status(400).send({ "status": "error", "message": "A document id is required" });
        }
        RecordModel.delete(req.body.document_id, function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getAll", function (req, res) {
        RecordModel.getAll(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getLatestMICUId", function (req, res) {
        RecordModel.getLatestMICUId(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getLatestSICUId", function (req, res) {
        RecordModel.getLatestSICUId(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getById/:id", function (req, res) {
        RecordModel.getById(req.params, function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getMICUIds", function (req, res) {
        RecordModel.getMICUIds(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/getSICUIds", function (req, res) {
        RecordModel.getSICUIds(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    // end of appRouter
};

module.exports = appRouter;