const express = require('express');
const INDEX_ROUTE = express.Router();
const { isAuthenticated, isNotAuthenticated, comparePassword } = require("../src/utils");
const DB = require("../src/database");
const CONFIG = require("../config");
const Employee = require("../models/Employee");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


INDEX_ROUTE.get(n2r["get-index"], isAuthenticated, async (req, res) => {
    return res.render(n2v["get-index"], {
        messages: req.flash('info'),
        user: req.session.user,
        n2r: n2r,
    });
});

INDEX_ROUTE.get(n2r["get-calendar"], isAuthenticated, async (req, res) => {
    let today = new Date();
    let year = parseInt(req.query.year) || today.getFullYear();
    let month = parseInt(req.query.month) || today.getMonth() + 1;

    if (year > today.getFullYear() || month > 12) {
        year = today.getFullYear();
        month = today.getMonth() + 1;
    }

    let firstDayOfMonth = new Date(year, month - 1, 1);
    let lastDayOfMonth = new Date(year, month, 0);

    const query = `
    SELECT *
    FROM event e
    WHERE e.date >= '${firstDayOfMonth.toISOString().split("T")[0]}' 
    AND e.date <= '${lastDayOfMonth.toISOString().split("T")[0]}';`;

    console.log(query);

    await DB.exec(query, [], (events) => {
        events = JSON.parse(JSON.stringify(events));
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = months[firstDayOfMonth.getMonth()];

        return res.render(n2v["get-calendar"], {
            title: CONFIG.BASE_TITLE,
            messages: req.flash('info'),
            user: req.session.user,
            events: events,
            monthName: monthName,
            months: months,
            month: month,
            year: year,
            n2r: n2r
        });
    });
});

module.exports = INDEX_ROUTE;
