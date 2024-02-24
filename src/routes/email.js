const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Email = Controllers.Email;

router.post("/signup-email", Email.SignUpEmail);
router.post("/verify-signup-otp", Email.VerifySignUpOTP);
module.exports = router;
