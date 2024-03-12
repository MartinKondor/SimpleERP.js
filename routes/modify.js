const express = require('express');
const logger = require('morgan');
const vCard = require('vcards-js');
const MODIFY_ROUTE = express.Router();
const DB = require("../src/database");
const CONFIG = require("../config");
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require("../src/utils");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


MODIFY_ROUTE.get(n2r["get-modify-event"], isAdmin, async (req, res) => {
    const eventId = req.query.id;
    const query = `
    SELECT
    *
    FROM event e
    WHERE e.id = ?;
    `;
    return DB.exec(query, [eventId], (event) => {
        if (!event || event.length === 0) {
            console.error("Event not found: id=" + event);
            return res.redirect(n2r["get-calendar"]);
        }
        console.log(event);
        return DB.exec("SELECT * FROM project p", [], (projects) => {
            return res.render(n2v["get-modify-event"], {
                title: CONFIG.BASE_TITLE,
                messages: req.flash('info'),
                user: req.session.user,
                event: JSON.parse(JSON.stringify(event[0])),
                projects: JSON.parse(JSON.stringify(projects)),
                n2r: n2r
            });
        });
    });
});

MODIFY_ROUTE.post(n2r["post-modify-event"], isAdmin, async (req, res) => {
    req.checkBody("name", "Please give it a name")
        .isLength({ min: 1 });
    req.checkBody("date", "Please give it a date")
        .isLength({ min: 1 });

    const errors = req.validationErrors();
    const selfUrl = n2r["post-modify-event"] + "?id=" + req.body.id;
    
    if (errors) {
        req.flash('info', {type: "danger", msg: errors[0].msg});
        return res.redirect(selfUrl);
    }

    const project_id = (req.body.project_id == "-1") ? null : (req.body.project_id || null);
    const inputsModify = [req.body.name, req.body.date, req.body.desc || null, project_id, req.body.id];
    const queryModify = "UPDATE event SET name=?, date=?, description=?, project_id=? WHERE id=?;";

    return await DB.exec(queryModify, inputsModify, async () => {
        req.flash('info', {type: "success", msg: "The modification was successful!"});
        return res.redirect(n2r["get-event"] + "?id=" + req.body.id);
    });
});


module.exports = MODIFY_ROUTE;
