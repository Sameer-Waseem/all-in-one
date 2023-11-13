const express = require("express");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");
const { Store } = require("../models/store");

// TODO: We can find store by getting store id from jwt also

router.post("/", async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { store_id, name, image } = req.body;

    const store = await Store.findOne({ _id: store_id });
    if (!store) return res.status(404).send("Store does not exist.");

    const product = await new Product({ store: store_id, name, image });
    product.save();

    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
