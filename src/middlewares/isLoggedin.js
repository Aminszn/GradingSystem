const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔒 Guard: Authorization header missing
  if (!authHeader) {
    return res.status(401).json({
      status: "failed",
      message: "Authorization header missing",
    });
  }

  const parts = authHeader.split(" ");

  // 🔒 Guard: malformed header
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: "failed",
      message: "Invalid authorization format",
    });
  }

  const token = parts[1];

  const verify = verifyToken(token);

  if (!verify) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid/expired token",
    });
  }

  req.userAuth = verify;
  next();
};

module.exports = isLoggedIn;
