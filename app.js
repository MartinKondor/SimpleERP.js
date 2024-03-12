"use strict";
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const logger = require('morgan');
const cors = require('cors');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const DB = require("./src/database");
const Employee = require('./models/Employee');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";


app.use(
    session({
      secret: "mvBDtTmvBDtTBsxg5Bsxg5",
      store: new MemoryStore({
        checkPeriod: 86400000  // 24hr
      }),
      cookie: {
        HttpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000  // 365 days
      },
      saveUninitialized: false,
      resave: false
    })
);

if (NODE_ENV === "development") {
    app.use(logger("dev"));

    //  Automatically log in with admin
    app.use((req, res, next) => {
        Employee.byEmail("admin@example.com", (adminUser) => {
            req.session.user = adminUser;
            next();
        });       
    });

} else {
    app.use(helmet());
    app.use(logger('tiny'));
    // https://express-rate-limit.github.io/ERR_ERL_PERMISSIVE_TRUST_PROXY/
    // app.enable("trust proxy");

    app.use(
        rateLimit({
            windowMs: 60 * 1000,  // 1 minutes
            limit: 500,
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	        legacyHeaders: false,
            message: `
            <style>
                .main {
                    font-family: sans-serif;
                    margin: 0 auto;
                    padding: 10px;
                }
            </style>
            <div class="main">
                <h1 style="color:red;">You've been blocked for a few seconds.</h1>
            </div>
            `
        }
    ));
}

app.set("view engine", "pug");
app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = null;
    }
    next();
});

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/", require("./routes/add"));  // /add
app.use("/", require("./routes/get"));  // /
app.use("/", require("./routes/modify"));  // /modify

logger.token('host', (req, res) => {
    return req.hostname;
});

if (NODE_ENV === "development") {
    app.listen(PORT, () => {
        console.log("------------------------------------");
        console.log('t =', Date.now());
        console.log(`http://127.0.0.1:${PORT}/\nOR\nhttp://localhost:${PORT}/`);
        console.log("------------------------------------");
    });
}

module.exports = app;
