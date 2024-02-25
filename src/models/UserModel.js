const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ["Admin", "Customer", "Seller"],
    },
    status: {
      type: String,
      required: true,
      default: "Active",
      trim: true,
      enum: ["Active", "Suspended", "Ban"],
    },
    active_session_refresh_token: { type: String },
    access_token: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
