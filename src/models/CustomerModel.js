const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

const CustomerModel = mongoose.model("customers", CustomerSchema);
module.exports = CustomerModel;
