const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User, Products } = require("../models");
const saltRounds = 10;
const {
  HandleSuccess,
  HandleServerError,
  Find,
  Insert,
  HandleError,
} = require("./BaseController");
const sendEmail = require("../services/email");

module.exports = {
  SaveProduct: async (req, res) => {
    try {
      const { _id } = req.user;
      const { images, productInfo, type, productDescription } = req.body;
      const saveProduct = await Insert({
        model: Products,
        data: { seller: _id, type, images, productInfo, productDescription },
      });

      if (!saveProduct) {
        return HandleError(res, "Failed to Insert Check Data Once.");
      }
      return HandleSuccess(res, {
        message: "Product Saved",
        data: saveProduct,
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
