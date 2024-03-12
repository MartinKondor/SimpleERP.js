"use strict";
const DB = require("../src/database");


class Employee {
    constructor() {
        this.isAdmin = false;
        this.isEmployee = false;
    }

    static async createUser(name, email, plainPassword, groupId) {
        try {
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            const query = 'INSERT INTO employee (name, email, password, group_id) VALUES (?, ?, ?, ?);';
            await DB.query(query, [name, email, hashedPassword, groupId]);
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }

    static async byEmail(email, callback) {
        const query = `
        SELECT
            e.id, e.name, e.email, e.password, e.group_id,
            g.name AS group_name, g.company AS group_company
        FROM
            employee e
        LEFT JOIN
            \`group\` g
        ON
            g.id=e.group_id
        WHERE
	        e.email=?;`;
        return await DB.exec(query, [email], (results) => {
            try {
                const userObject = JSON.parse(JSON.stringify(results[0]));
                if (userObject.group_name.toLowerCase() == "admin") {
                    this.isAdmin = true;
                    userObject.isAdmin = true;
                }
                if (userObject.group_name.toLowerCase() == "employee") {
                    this.isEmployee = true;
                    userObject.isEmployee = true;
                }
                return callback(userObject);
            }
            catch (e) {
                console.error(e);
                return callback(null);
            }
        });
    }
}

module.exports = Employee;
