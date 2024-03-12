const express = require('express');
const DELETE_ROUTE = express.Router();
const DB = require("../src/database");
const { isAdmin } = require("../src/utils");


DELETE_ROUTE.post("/event", isAdmin, async (req, res) => {
    const deleteQuery = `
    DELETE FROM event WHERE event.id=?
    `;
    return await DB.exec(deleteQuery, [req.body.id], async () => {
        req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
        return res.redirect("/calendar#" + req.body.id);
    });
});

DELETE_ROUTE.post("/contact", isAdmin, async (req, res) => {
    const deleteQuery = `
    DELETE FROM contact WHERE contact.id=?
    `;
    return await DB.exec(deleteQuery, [req.body.id], async () => {
        req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
        return res.redirect("/contacts#" + req.body.id);
    });
});

DELETE_ROUTE.post("/employee", isAdmin, async (req, res) => {
    const deleteQuery = `
    DELETE FROM employee WHERE employee.id=?
    `;
    return await DB.exec(deleteQuery, [req.body.id], async () => {
        req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
        return res.redirect("/employees#" + req.body.id);
    });
});

DELETE_ROUTE.post("/offer", isAdmin, async (req, res) => {
    const deletePartsQuery = `DELETE FROM offer_attachment WHERE offer_attachment.offer_id=?`;
    const deleteQuery = `DELETE FROM offer WHERE offer.id=?`;
    return await DB.exec(deletePartsQuery, [req.body.id], async () => {
        return await DB.exec(deleteQuery, [req.body.id], async () => {
            req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
            return res.redirect("/offers#" + req.body.id);
        });
    });
});

DELETE_ROUTE.post("/offer/attachment", isAdmin, async (req, res) => {
    const deleteQuery = `DELETE FROM offer_attachment WHERE offer_id=? AND attachment=?`;
    return await DB.exec(deleteQuery, [req.query.offer_id, req.query.attachment], async () => {
        req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
        return res.redirect("/offer?id=" + req.query.offer_id);
    });
});

DELETE_ROUTE.post("/project/attachment", isAdmin, async (req, res) => {
    const deleteQuery = `DELETE FROM project_attachment WHERE project_id=? AND attachment=?`;
    return await DB.exec(deleteQuery, [req.query.project_id, req.query.attachment], async () => {
        req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
        return res.redirect("/project?id=" + req.query.project_id);
    });
});

DELETE_ROUTE.post("/project", isAdmin, async (req, res) => {
    const deletePartsQuery = `DELETE FROM project_attachment WHERE project_attachment.project_id=?`;
    const deleteQuery = `DELETE FROM project WHERE project.id=?`;
    return await DB.exec(deletePartsQuery, [req.body.id], async () => {
        return await DB.exec(deleteQuery, [req.body.id], async () => {
            req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
            return res.redirect("/projects#" + req.body.id);
        });
    });
});

DELETE_ROUTE.post("/company", isAdmin, async (req, res) => {
    const basicErrMsg = "Nem lehet törölni a céget, mert még van hozzá tartozó ";
    const checkProjectsQuery = `SELECT * FROM project p WHERE p.company_id=?`;
    const checkContactsQuery = `SELECT * FROM contact n WHERE n.company_id=?`;
    const checkOffersQuery = `SELECT * FROM offer a WHERE a.company_id=?`;
    const deleteQuery = `DELETE FROM company WHERE company.id=?`;

    return await DB.exec(checkProjectsQuery, [req.body.id], async (projects) => {
        console.log(projects);
        if (projects.length != 0) {
            req.flash('info', { type: "danger", msg: basicErrMsg + "projekt" });
            return res.redirect("/company?id=" + req.body.id);
        }
        else {
            return await DB.exec(checkContactsQuery, [req.body.id], async (contacts) => {
                console.log(contacts);
                if (contacts.length != 0) {
                    req.flash('info', { type: "danger", msg: basicErrMsg + "névjegy" });
                    return res.redirect("/company?id=" + req.body.id);
                }
                else {
                    return await DB.exec(checkOffersQuery, [req.body.id], async (offers) => {
                        console.log(offers);
                        if (offers.length != 0) {
                            req.flash('info', { type: "danger", msg: basicErrMsg + "árajánlat" });
                            return res.redirect("/company?id=" + req.body.id);
                        }
                        else {
                            return await DB.exec(deleteQuery, [req.body.id], async () => {
                                req.flash('info', {type: "success", msg: "A törlés sikeresen végrehajtva"});
                                return res.redirect("/companies#" + req.body.id);
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = DELETE_ROUTE;
