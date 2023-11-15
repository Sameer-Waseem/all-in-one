const express = require("express");
const mongoose = require("mongoose");
const { Store } = require("../models/store");
const { Product } = require("../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("user", "-_id first_name last_name")
      .select("user category");

    res.status(200).send({
      message: "All stores.",
      stores: stores.map((store) => ({
        id: store._id,
        name: store.user.fullName(),
        category: store.category,
      })),
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid ID.");

    const store = await Store.findById(req.params.id).populate("user");
    if (!store) return res.status(404).send("Store does not exist.");

    const products = await Product.find({ store: store._id }).select(
      "name image"
    );

    res.status(200).send({
      store: { id: store._id, name: store.user.fullName() },
      products,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
