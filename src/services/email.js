const nodemailer = require("nodemailer");
const { smtp_email, smtp_password, smtp_host } = require("../config/vars");

const transporter = nodemailer.createTransport({
  host: smtp_host,
  port: 465,
  secure: true,
  auth: {
    user: smtp_email,
    pass: smtp_password,
  },
});
function sendEmail(receiver, subject, text, html) {
  let mailOptions = {
    from: "AKME Sender", // sender address
    to: receiver,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return info.messageId;
  });
}

module.exports = sendEmail;
