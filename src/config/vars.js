const dotenv = require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  mongodb: process.env.MONGO_CONNECTION_STRING,
  secret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
  tokenExpiryLimit: 86400,
  otpExpiryLimit: 1,
  isAppSocketIOEnable: false,
  host_url: process.env.HOST_URL,
  frontend_host_url: process.env.FRONTEND_HOST_URL,
  smtp_email: process.env.SMTP_EMAIL,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_host: process.env.SMTP_HOSTNAME,
};
