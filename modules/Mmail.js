require('dotenv').config()
const nodemailer = require("nodemailer");

const { 
    MAIL_USERNAME,
    MAIL_PASSWORD, 
    OAUTH_CLIENTID, 
    OAUTH_CLIENT_SECRET, 
    OAUTH_REFRESH_TOKEN
} = process.env


const sendEmail = async (email, subject, body) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
            clientId: OAUTH_CLIENTID,
            clientSecret: OAUTH_CLIENT_SECRET,
            refreshToken: OAUTH_REFRESH_TOKEN
        }
    });
    
    let mailOptions = { //set content of the mail
        from: MAIL_USERNAME,
        to: email,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (err, maildata) => { //send mail to user
        if (err) { //catch errors
            const response = [{statusCode: 500, message: "SERVER ERROR"}]
            return response
        }
    });
};

// Export function
module.exports = { sendEmail }