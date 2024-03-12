const express = require('express');
const logger = require('morgan');
const vCard = require('vcards-js');
const GET_ROUTE = express.Router();
const DB = require("../src/database");
const CONFIG = require("../config");
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require("../src/utils");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


GET_ROUTE.get(n2r["get-event"], isAuthenticated, async (req, res) => {
    const query = `
    SELECT
    e.id, e.name, e.date, e.description,
    p.id AS project_id, p.deadline AS project_deadline, p.status AS project_status, p.description AS projekt_description
    FROM event e
    LEFT JOIN project p
    ON p.id=e.project_id
    WHERE e.id=?`;
    return await DB.exec(query, [req.query.id], async (event) => {
        if (event == null || event.length == 0) {
            return res.redirect(n2r["get-calendar"]);
        }
        return res.render(n2v["get-event"], {
            title: CONFIG.BASE_TITLE,
            messages: req.flash('info'),
            user: req.session.user,
            event: JSON.parse(JSON.stringify(event[0])),
            n2r: n2r
        });
    });
});

module.exports = GET_ROUTE;
