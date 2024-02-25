const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Admin = Controllers.Admin;

router.get("/accounts", Admin.GetUsers);
module.exports = router;
