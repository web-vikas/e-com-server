const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User, Products } = require("../models");
const saltRounds = 10;
const {
  HandleSuccess,
  HandleServerError,
  Find,
  Aggregate,
} = require("./BaseController");
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
  GetProducts: async (req, res) => {
    try {
      const { pageSize = 10, page = 1 } = req.query;
      const offset = (page - 1) * pageSize;

      const products = await Aggregate({
        model: Products,
        data: [
          {
            $limit: pageSize,
          },
          {
            $skip: offset,
          },
          {
            $project: {
              images: "$images.front",
              title: "$productDescription.title",
              price: "$productInfo.priceSelling",
              skuId: "$productInfo.skuId",
              status: "$productInfo.listingStatus",
              createdAt: 1,
            },
          },
        ],
      });

      const totalProducts = await Products.count();

      return HandleSuccess(res, {
        data: products,
        totalProducts,
        pageSize,
        page,
        message: "Product Fetched Successfully.",
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
