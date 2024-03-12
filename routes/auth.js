const express = require('express');
const AUTH_ROUTE = express.Router();
const { isAuthenticated, isNotAuthenticated, comparePassword } = require("../src/utils");
const Employee = require("../models/Employee");

const n2r = require("./name2route.json");
const n2v = require("./name2view.json");


AUTH_ROUTE.get(n2r["get-signin"], isNotAuthenticated, async (req, res) => {
    return res.render(n2v["get-signin"], {
        n2r: n2r,
        messages: req.flash('info'),
    });
});

AUTH_ROUTE.post(n2r["post-signin"], isNotAuthenticated, async (req, res) => {
    req.checkBody("email", "")
        .isEmail()
        .isLength({ min: 1 });
    req.checkBody("password", "")
        .isLength({ min: 1 });

    const selfUrl = n2r["get-signin"];
    const errors = req.validationErrors();
    const email = req.body.email;
    const password = req.body.password;
    
    if (errors) {
        req.flash('info', {type: "danger", msg: "Error during signin (101)"});
        return res.redirect(selfUrl);
    }
    else {
        return await Employee.byEmail(email, async (user) => {
            if (!user) {
                req.flash('info', {type: "danger", msg: "Error during signin (102)"});
                return res.redirect(selfUrl);
            }
            else {
                const passwordMatch = await comparePassword(password, user.password);
                if (!passwordMatch) {
                    req.flash('info', {type: "danger", msg: "Error during signin (103)"});
                    return res.redirect(selfUrl);
                }
                else {
                    req.session.user = user;
                    return res.redirect(n2r["get-index"]);
                }
            }
        });
    }
});

AUTH_ROUTE.get(n2r["get-signout"], isAuthenticated, async (req, res) => {
    req.session.user = null;
    return res.redirect(n2r["get-signin"]);
});

module.exports = AUTH_ROUTE;
