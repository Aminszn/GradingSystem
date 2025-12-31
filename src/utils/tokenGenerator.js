const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign( payload , process.env.JWT_SECRET_KEY, { expiresIn: "6d" });
};

module.exports = generateToken;
