const express = require('express');
const INDEX_ROUTE = express.Router();
const { isAuthenticated, isNotAuthenticated, comparePassword } = require("../src/utils");
const Employee = require("../models/Employee");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


INDEX_ROUTE.get(n2r["get-index"], isAuthenticated, async (req, res) => {
    return res.render(n2v["get-index"], {
        n2r: n2r,
        messages: req.flash('info'),
    });
});

module.exports = INDEX_ROUTE;
