require("dotenv").config();
const config = require("config");
const jwt = require("jsonwebtoken");

auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Sorry but you need to be logged in!" });
  }
};

module.exports = auth;
