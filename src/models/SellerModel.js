const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema(
  {
    Seller: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

const SellerModel = mongoose.model("sellers", SellerSchema);
module.exports = SellerModel;
