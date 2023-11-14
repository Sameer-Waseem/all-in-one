const jwt = require("jsonwebtoken");
const config = require("config");

function authorization(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.decoded_user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

exports.authorization = authorization;
