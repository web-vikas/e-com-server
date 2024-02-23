const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User } = require("../models");
const saltRounds = 10;
const { HandleSuccess, HandleServerError } = require("./BaseController");
const sendEmail = require("../services/email");

module.exports = {
  Login: async (req, res, next) => {
    try {
      const { email = "", password = "" } = req.body;

      // Call the sendEmail function
      sendEmail(email, "Hello", "Hello world?", "<b>Hello world?</b>");
      return HandleSuccess(res, true);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
  SignUp: async (req, res, next) => {
    try {
      const { email = "" } = req.body;

      return HandleSuccess(res, true);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
