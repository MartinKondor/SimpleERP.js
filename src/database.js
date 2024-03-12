"use strict";
const mysql = require('mysql');
const { DB_INFO } = require("../config");


const DB = mysql.createConnection(DB_INFO);
DB.connect();

DB.exec = (query, inputs, callback) => {
	return DB.query(query, inputs, (err, res) => {
		if (err) {
			console.error(err);
			return callback(null);
		}
		else {
			return callback(res);
		}
	});
};

DB.execMultiple = (queries, callback) => {
    const results = [];
    let index = 0;

    const executeQuery = () => {
        if (index < queries.length) {
            const { query, values } = queries[index];
            DB.query(query, values, (err, res) => {
                if (err) {
                    console.error(err);
                    results.push(null);
                } else {
                    results.push(res);
                }
                index++;
                executeQuery();
            });
        } else {
            callback(results);
        }
    };

    executeQuery();
};

module.exports = DB;
