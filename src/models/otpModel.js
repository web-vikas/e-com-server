const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiry: { type: String, required: true },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["signup"],
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model("otp", OtpSchema);
module.exports = OtpModel;
