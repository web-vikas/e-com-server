const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User } = require("../models");
const saltRounds = 10;
const { HandleSuccess, HandleServerError } = require("./BaseController");
const sendEmail = require("../services/email");

module.exports = {
  Dashboard: async (req, res, next) => {
    try {
      const { email = "", password, name, phone } = req.body;

      return HandleSuccess(res, true);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
