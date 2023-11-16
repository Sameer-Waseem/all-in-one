const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateAuth } = require("../models/user");
const { Customer } = require("../models/customer");
const { Store } = require("../models/store");

router.post("/", async (req, res) => {
  try {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or passwrod.");

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      return res.status(400).send("Invalid email or passwrod.");

    const token = user.generateAuthToken();

    let response;
    if (user.isCustomer()) {
      const customer = await Customer.findOne({ user: user._id });

      response = {
        name: user.fullName(),
        phone: user.phone,
        email: user.email,
        address: customer.address,
        token,
      };
    } else if (user.isStore()) {
      const store = await Store.findOne({ user: user._id });

      response = {
        name: user.fullName(),
        store_name: store.store_name,
        phone: user.phone,
        email: user.email,
        category: store.category,
        token,
      };
    }

    res
      .status(200)
      .send({ message: "Logged in successfully.", user: response });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
