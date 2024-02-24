const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Email = Controllers.Email;

router.post("/sign-up", Email.SignUpEmail);
router.post("/verify-signup", Email.VerifySignUpOTP);
module.exports = router;
