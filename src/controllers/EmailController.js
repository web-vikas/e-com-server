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
  Delete,
} = require("./BaseController");
const sendEmail = require("../services/email");
const moment = require("moment");

module.exports = {
  /**
   * Sends an OTP to the provided email for signing up.
   * @param {Object} req - The request object containing the email in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Object} The response object.
   */
  SignUpEmail: async (req, res, next) => {
    try {
      const { email = "" } = req.body;
      if (!ValidateEmail(email)) {
        return HandleError(res, "Invalid Email");
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

      // Save or update OTP in the database
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
          return HandleError(res, "Failed To Send OTP");
        }
      }

      // Send OTP via email
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

  /**
   * Verifies the OTP for signing up.
   * Deletes the OTP after verification.
   * @param {Object} req - The request object containing the email and otp in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Object} The response object.
   */
  VerifySignUpOTP: async (req, res, next) => {
    try {
      const { email = "", otp = "" } = req.body;

      // Verify OTP
      const isEmailExistInOTP = await IsExistsOne({
        model: OTP,
        where: { email, otp, type: "signup" },
      });

      if (!isEmailExistInOTP) {
        return HandleError(res, "Invalid OTP");
      }

      const currentTime = moment();
      const otpData = await FindOne({
        model: OTP,
        where: { email, otp, type: "signup" },
      });

      // Check OTP expiry
      if (!otpData || moment(otpData.expiry).isBefore(currentTime)) {
        return HandleError(res, "OTP Expired");
      }

      // Delete OTP after verification
      Delete({
        model: OTP,
        where: { email, otp, type: "signup" },
      });

      return HandleSuccess(res, {
        message: "OTP Verified Successfully.",
        status: 200,
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
