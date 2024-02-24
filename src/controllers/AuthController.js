const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User } = require("../models");
const saltRounds = 10;
const {
  HandleSuccess,
  HandleServerError,
  ValidateEmail,
  HandleError,
  IsExistsOne,
  Insert,
  GeneratePassword,
  FindOne,
  FindAndUpdate,
} = require("./BaseController");

module.exports = {
  /**
   * Logs in a user with the provided email and password.
   * @param {Object} req - The request object containing the email and password in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Object} The response object.
   */
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!ValidateEmail(email)) {
        return HandleError(res, "Invalid Email", 400);
      }
      if (!password) {
        return HandleError(res, "Please Enter Password .", 400);
      }

      // Find user by email
      const user = await FindOne({
        model: User,
        where: {
          email: email,
        },
      });

      if (!user) {
        return HandleError(res, "User not found.", 404);
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return HandleError(res, "Invalid Password.", 400);
      }

      // Generating a JWT token
      const active_session_refresh_token = GeneratePassword();
      const access_token = jwt.sign(
        { id: user._id, email: user.email },
        Config.secret,
        {
          expiresIn: Config.tokenExpiryLimit,
        }
      );

      // Update user with new access token and refresh token
      let updated = await FindAndUpdate({
        model: User,
        where: { _id: user._id },
        update: {
          $set: {
            access_token: access_token,
            active_session_refresh_token: active_session_refresh_token,
          },
        },
      });

      if (!updated) return HandleError(res, "Failed to generate access token.");

      return HandleSuccess(res, {
        message: "Login successful.",
        data: {
          _id: user._id,
          email: user.email,
          access_token,
          active_session_refresh_token,
        },
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },

  /**
   * Signs up a new user with the provided email, password, name, and phone number.
   * @param {Object} req - The request object containing the email, password, name, and phone in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Object} The response object.
   */
  SignUp: async (req, res, next) => {
    try {
      const { email, password, name, phone } = req.body;
      if (!ValidateEmail(email)) {
        return HandleError(res, "Invalid Email", 400);
      }
      if (!password) {
        return HandleError(res, "Please Enter Password .", 400);
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
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Save new user to the database
      const saveCustomer = await Insert({
        model: User,
        data: { email, password: passwordHash, name, phone, role: "Customer" },
      });
      if (!saveCustomer) {
        return HandleError(res, "Failed To Create Account !", 502);
      }
      return HandleSuccess(res, {
        message: "Customer Created Successfully.",
        data: saveCustomer,
      });
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
