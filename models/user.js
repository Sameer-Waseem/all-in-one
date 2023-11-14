const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    requied: true,
    minlength: 3,
    maxlength: 50,
  },
  last_name: {
    type: String,
    requied: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: Number,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  user_role: {
    type: String,
    default: "Customer",
    enum: ["Admin", "Customer", "Store"],
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.user_role },
    config.get("jwtPrivateKey")
  );
};

userSchema.methods.isAdmin = function () {
  return this.user_role === "Admin";
};

userSchema.methods.isCustomer = function () {
  return this.user_role === "Customer";
};

userSchema.methods.isStore = function () {
  return this.user_role === "Store";
};

const User = mongoose.model("User", userSchema);

function validateRegister(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(50).required(),
    last_name: Joi.string().min(3).max(50).required(),
    phone: Joi.number().min(3).required(),
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
    user_role: Joi.string().valid("Admin", "Customer", "Store"),
    category: Joi.string().min(3).max(50).when("user_role", {
      is: "Store",
      then: Joi.required(),
    }),
  });

  return schema.validate(user);
}

function validateAuth(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateRegister = validateRegister;
exports.validateAuth = validateAuth;
