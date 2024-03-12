"use strict";

const EMAIL_HEADER = `
<p>YourCompany</p>
<br/>
`;
const EMAIL_FOOTER = `
<br/>
<p>Please do not answer to this email address.</p>
<p>&copy; YourCompany Inc.</p>
`;

module.exports = {
    DB_INFO: {
        host     : 'localhost',
        user     : 'root',
        password : '',
        port	 : 3306,
        database : 'simpleerpjs',
        multipleStatements: true
    },
    UPLOADS_FOLDER: 'uploads/',
    BASE_TITLE: "SimpleERP",
    SIGNIN_NOK: "Incorrect login credentials",
    ERROR_MSG: "Something went wrong, please try again later!",
    PASSWORD_RECOVERY_OK: "We have sent an email with further instructions regarding password recovery!",
    PASSWORD_RECOVERY_OK_BAD_RECOVERY_TOKEN: "Incorrect recovery code",
    PASSWORD_RECOVERY_NOK: "There is no such email address in the system!",
    BAD_FILE_FORMAT_ERROR: "Sorry, This File Type Is Not Permitted for Security Reasons",
    PASSWORD_RECOVERY_EMAIL: (token) => {
        const tokenAnchor = `<a href="/forgot/recovery?token=${token}">${token}</a>`;
        return EMAIL_HEADER + "Recovery key: " + tokenAnchor + EMAIL_FOOTER;
    }
}
