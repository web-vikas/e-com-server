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

async function sendEmail(receiver, subject, text, html) {
  let mailOptions = {
    from: "AKME Sender",
    to: receiver,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    return info.messageId;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = sendEmail;
