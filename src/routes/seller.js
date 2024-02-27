const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Seller = Controllers.Seller;

router.post("/new-product", Seller.SaveProduct);
module.exports = router;
