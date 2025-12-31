const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {

    if (!allowedRoles.includes(req.userAuth.role)) {
      return res.status(403).json({
        status: "failed",
        message: "Access denied",
      });
    }

    next();
  };
};

const authorizePosition = (allowedPositions = []) => {
  return (req, res, next) => {

    if (!allowedPositions.includes(req.userAuth.position)) {
      return res.status(403).json({
        status: "failed",
        message: "Access denied",
      });
    }

    next();
  };
}

module.exports = { authorizeRole, authorizePosition };
