const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User, OTP } = require("../models");
const saltRounds = 10;
const {
  HandleSuccess,
  HandleServerError,
  ValidateEmail,
  HandleError,
  GenerateOTP,
  Insert,
  FindOne,
  IsExistsOne,
  FindAndUpdate,
} = require("./BaseController");
const sendEmail = require("../services/email");
const moment = require("moment");

module.exports = {
  SignUpEmail: async (req, res, next) => {
    try {
      const { email = "" } = req.body;
      if (!ValidateEmail(email)) {
        return HandleError(res, "Invalid Email", 400);
      }

      const isEmailExist = await IsExistsOne({
        model: User,
        where: {
          email: email,
        },
      });

      if (isEmailExist) {
        return HandleError(res, "Email Already Exist !");
      }

      const currentOTP = GenerateOTP();
      const expiryTime = moment().add(5, "minutes");

      const isEmailExistInOTP = await FindAndUpdate({
        model: OTP,
        where: { email },
        update: { otp: currentOTP, expiry: expiryTime },
      });

      if (!isEmailExistInOTP) {
        const saveOTP = await Insert({
          model: OTP,
          data: { email, otp: currentOTP, expiry: expiryTime, type: "signup" },
        });
        if (!saveOTP) {
          return HandleError(res, "Failed To Send OTP", 502);
        }
      }

      sendEmail(
        email,
        "BitBiltz OTP For Sign Up",
        "BitBiltz OTP",
        `<strong>Your OTP is : ${currentOTP}</strong>`
      );
      return HandleSuccess(res, {
        message: "OTP Send Successfully.",
        status: 200,
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
  VerifySignUpOTP: async (req, res, next) => {
    try {
      const { email = "", otp = "" } = req.body;

      const isEmailExistInOTP = await IsExistsOne({
        model: OTP,
        where: { email, otp, type: "signup" },
      });

      if (!isEmailExistInOTP) {
        return HandleError(res, "Invalid OTP", 400);
      }

      const currentTime = moment();
      const otpData = await FindOne({
        model: OTP,
        where: { email, otp, type: "signup" },
      });

      if (!otpData || moment(otpData.expiry).isBefore(currentTime)) {
        return HandleError(res, "OTP Expired", 400);
      }

      return HandleSuccess(res, {
        message: "OTP Verified Successfully.",
        status: 200,
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
