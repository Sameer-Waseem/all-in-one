const express = require("express");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");
const { Store } = require("../models/store");
const { authorization } = require("../middleware/authorization");
const { isStore } = require("../middleware/store");

router.post("/", [authorization, isStore], async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const store = await Store.findOne({ user: req.decoded_user._id });
    if (!store) return res.status(404).send("Store does not exist.");

    const product = await new Product({ store: store._id, ...req.body });
    product.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
