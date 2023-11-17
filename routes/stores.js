const express = require("express");
const mongoose = require("mongoose");
const { Store } = require("../models/store");
const { Product } = require("../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find().select("category store_name");

    res.status(200).send({
      message: "All stores.",
      stores,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid ID.");

    const store = await Store.findById(req.params.id)
      .select("user category store_name")
      .populate("user", "-_id phone email");

    if (!store) return res.status(404).send("Store does not exist.");

    const products = await Product.find({ store: store._id }).select(
      "name image"
    );

    res.status(200).send({
      _id: store._id,
      store_name: store.store_name,
      category: store.category,
      phone: store.user.phone,
      email: store.user.email,
      products,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
