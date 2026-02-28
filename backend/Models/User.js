const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email:{
    type:String,
    unique:true
  } ,
  amount: Number,
  orderId: String,
  status: { type: String, default: "pending" },
  trackingId: String,
  bankRefNo: String,
});

module.exports = mongoose.model("User", userSchema);