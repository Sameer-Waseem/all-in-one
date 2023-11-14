function store(req, res, next) {
  if (req.decoded_user.role !== "Store")
    return res.status(403).send("Access denied");
  next();
}

exports.isStore = store;
