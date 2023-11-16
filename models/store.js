const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    minlenght: 3,
    maxlength: 50,
    required: true,
  },
  store_name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    validate: {
      validator: function (value) {
        return this.user_role === "Store" ? value : true;
      },
    },
    required: true,
  },
});

const Store = mongoose.model("Store", storeSchema);

exports.Store = Store;
