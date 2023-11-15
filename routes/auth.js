const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateAuth } = require("../models/user");

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

    res.status(200).send({ message: "Logged in successfully.", token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
