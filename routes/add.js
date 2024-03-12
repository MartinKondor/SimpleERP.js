const express = require('express');
const ADD_ROUTE = express.Router();
const DB = require("../src/database");
const CONFIG = require("../config");
const multer = require('multer');
const {
    isAuthenticated,
    isMunkatars,
    encryptPassword,
    isAdmin,
    upload,
    formatUploadedFilename
} = require("../src/utils");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


ADD_ROUTE.get(n2r["get-add-event"], isAdmin, async (req, res) => {
    let day = new Date(req.query.day * 1000) || null;
    return await DB.exec("SELECT * FROM project", [], async (projects) => {
        return res.render(n2v["get-add-event"], {
            title: CONFIG.BASE_TITLE,
            messages: req.flash('info'),
            user: req.session.user,
            projects: JSON.parse(JSON.stringify(projects)),
            day: day,
            n2r: n2r
        });
    });
});

ADD_ROUTE.post(n2r["post-add-event"], isAdmin, async (req, res) => {
    req.checkBody("name", "Please give it a name")
        .isLength({ min: 1 });
    req.checkBody("date", "Please give it a date")
        .isLength({ min: 1 });

    const errors = req.validationErrors();
    const selfUrl = n2r["post-add-event"];
    
    if (errors) {
        req.flash('info', {type: "danger", msg: errors[0].msg});
        return res.redirect(selfUrl);
    }

    const project_id = (req.body.project_id == "-1") ? null : (req.body.project_id || null);
    const inputsAdd = [req.body.name, req.body.date, req.body.desc || null, project_id];
    const queryAdd = "INSERT INTO event (name, date, description, project_id) VALUES (?, ?, ?, ?);";

    return await DB.exec(queryAdd, inputsAdd, async () => {
        req.flash('info', {type: "success", msg: "The new event is successfully saved!"});
        return res.redirect("/calendar");
    });
});

module.exports = ADD_ROUTE;
