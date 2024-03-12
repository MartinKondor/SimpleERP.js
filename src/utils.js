"use strict";
const bcrypt = require('bcryptjs');
const DB = require("../src/database");
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { BAD_FILE_FORMAT_ERROR, UPLOADS_FOLDER } = require("../config");

const n2r = require("../routes/name2route.json");


Object.defineProperty(exports, "__esModule", { value: true });


exports.isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        return res.redirect(n2r["get-index"]);
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect(n2r["get-signin"]);
    }
};
exports.isAuthenticated = isAuthenticated;

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    } else {
        return res.redirect(n2r["get-index"]);
    }
};
exports.isAdmin = isAdmin;

const isEmployee = (req, res, next) => {
    if (req.session.user && (req.session.user.isEmployee || req.session.user.isAdmin)) {
        return next();
    } else {
        return res.redirect(n2r["get-index"]);
    }
};
exports.isEmployee = isEmployee;

exports.encryptPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
};

exports.comparePassword = async (plainPassword, password) => {
    return await bcrypt.compare(plainPassword, password);
};

// The folder of uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.originalname);
    }
});

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10  // Limit file size to 10 GB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /\.(exe|dll|bat|sh|cmd|com|js|py|php|pl|docm|xlsm|pptm|dotm|jar|swf|torrent|iso|msi|cgi|pif|scr)$/i;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname || mimetype) {
            cb(new multer.MulterError(BAD_FILE_FORMAT_ERROR));
        } else {
            return cb(null, true);
        }
    }
});

exports.bannedFileTypes = [
    "application/x-msdownload",
    "application/x-msdos-program",
    "application/x-executable",
    "application/javascript",
    "text/javascript",
    "text/python",
    "application/x-javascript",
    "application/octet-stream",
    "application/x-msdos-program",
    "application/x-msdownload",
    "application/x-msdos-program",
    "application/bat"
];

exports.formatUploadedFilename = (fname) => {
    return fname.replaceAll("\\", "/");
};

const stringifyJSON = (data, indent) => {
    const visited = new Set();
    const replacer = (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
                return '[Circular Reference]';
            }
            visited.add(value);
        }
        return value;
    };
    const cleanData = JSON.stringify(data, replacer, indent);
    return cleanData;
};
exports.stringifyJSON = stringifyJSON;

exports.attemptedHacking = (req, res, callback) => {
    const fileName = "logs/hacks.log"
    return fs.appendFile(fileName, new Date().toLocaleString() + ":\n" + stringifyJSON(req, 4) + "\n", (error) => {
        console.error(error);
        req.session.user = null;
        return callback(req, res);
    });
};
