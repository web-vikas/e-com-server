const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    name: { type: String, trim: true, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: { type: String },
    alternatePhone: { type: String },
    addressType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Home", "Work"],
    },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("address", AddressSchema);
module.exports = AddressModel;
