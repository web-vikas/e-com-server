const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User } = require("../models");
const saltRounds = 10;
const { HandleSuccess, HandleServerError, Find } = require("./BaseController");
const sendEmail = require("../services/email");

module.exports = {
  Dashboard: async (req, res) => {
    try {
      const { email = "", password, name, phone } = req.body;

      return HandleSuccess(res, true);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
  GetUsers: async (req, res) => {
    try {
      const { pageSize = 10, page = 1 } = req.query;
      const offset = (page - 1) * pageSize;

      const users = await Find({
        model: User,
        limit: pageSize,
        skip: offset,
        select: "_id name email role status createdAt",
      });

      const totalUsers = await User.count();

      return HandleSuccess(res, {
        data: users,
        totalUsers,
        pageSize,
        page,
        message: "Account Fetched Successfully.",
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
