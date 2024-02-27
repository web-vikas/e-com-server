const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    type: { type: String, trim: true, required: true },
    images: { type: Object, required: true },
    productInfo: { type: Object, required: true },
    productDescription: { type: Object, required: true },
    additionalDetails: { type: Object },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
