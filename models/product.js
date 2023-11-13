const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  name: {
    type: String,
    minlenght: 3,
    maxlength: 50,
    required: true,
  },
  image: String,
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    store_id: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }

        return value;
      })
      .required(),
    name: Joi.string().min(3).max(50).required(),
    image: Joi.string(),
  });

  return schema.validate(product);
}

exports.validateProduct = validateProduct;
exports.Product = Product;
