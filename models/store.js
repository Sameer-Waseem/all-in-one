const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    minlenght: 3,
    maxlength: 50,
    required: true,
  },
});

const Store = mongoose.model("Store", storeSchema);

exports.Store = Store;
