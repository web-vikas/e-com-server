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
  Aggregate,
} = require("./BaseController");

module.exports = {
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
              mrp: "$productInfo.priceMRP",
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
