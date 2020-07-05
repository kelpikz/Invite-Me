const nodemailer = require("nodemailer");
require('dotenv').config();  //for mail and password
const senderEmail = process.env.S_EMAIL;
const senderPassword = process.env.S_PASSWORD;

module.exports = {
  sendMail: async (subject, text, to) => {
    try {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: senderEmail,
        pass: senderPassword,
        },
    });

    const message = {
        from: `report sender <${senderEmail}>`,
        to,
        subject,
        text: subject,
        html: text,
    };

    await transporter.sendMail(message, () => {});
    } catch (err) {
    console.log('some error occoured');
    }
  },
};