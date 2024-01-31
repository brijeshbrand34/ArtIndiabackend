const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  OrderId: { type: String, require: true },
  OrderUserName: { type: String },
  OrderEventId: { type: String, require: true },
  EventDate: { type: String, require: true },
  EventTime: { type: String },
  UserEmail: { type: String },
  UserMobile: { type: String },
  // Ordercount: { type: Number },
  OrderPrice: { type: Number },
  Numberofseat: { type: Number },
});
const Orders = mongoose.model("Orders", OrderSchema);
module.exports = Orders;
