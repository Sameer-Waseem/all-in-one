const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateRegister } = require("../models/user");
const { Customer } = require("../models/customer");
const { Store } = require("../models/store");

router.post("/", async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists.");

    const hashPassword = await bcrypt.hash(password, 10);
    user = new User({ ...req.body, password: hashPassword });
    await user.save();

    let response;
    if (user.isCustomer()) {
      const customer = await new Customer({
        user: user._id,
        address: req.body.address,
      });

      customer.save();

      response = {
        name: user.fullName(),
        phone: user.phone,
        email: user.email,
        address: customer.address,
      };
    } else if (user.isStore()) {
      const store = await new Store({
        user: user._id,
        store_name: req.body.store_name,
        category: req.body.category,
      });

      store.save();

      response = {
        name: user.fullName(),
        store_name: store.store_name,
        phone: user.phone,
        email: user.email,
        category: store.category,
      };
    }

    const token = user.generateAuthToken();

    res.status(200).header("x-auth-token", token).send({
      message: "User created successfully.",
      user: response,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
