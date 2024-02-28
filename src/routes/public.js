const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Public = Controllers.Public;

router.get("/get-products", Public.GetProducts);
module.exports = router;
