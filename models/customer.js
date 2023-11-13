const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    minlenght: 3,
    maxlenght: 1024,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
