const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const auth = require("./routes/auth");
const register = require("./routes/register");
const products = require("./routes/products");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/all-in-one")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Failed to connect MongoDB...", error));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/register", register);
app.use("/api/product", products);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
