const express = require("express");
const {
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getAllStaff,
} = require("../../staffs/controllers/staffController");

// Middleware
const isLoggedIn = require("../../middlewares/isLoggedin");
const {authorizeRole, authorizePosition} = require("../../middlewares/authorize");

const staffRouter = express.Router();

/**
 * Admin / Receptionist Routes – register and manage staff
 */
staffRouter
  .route("/register")
  .post(isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), createStaff);

staffRouter
  .route("/:id")
  .delete(isLoggedIn, authorizeRole(["admin"]), deleteStaff);

staffRouter
  .route("/getAll")
  .get(isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), getAllStaff);

/**
 * Staff (self) or Admin Routes – view profile
 */
staffRouter
  .route("/:id/profile")
  .get(isLoggedIn, authorizeRole(["admin", "staff"]), getStaffById);

/**
 * Update Staff – Staff limited, Admin full
 */
staffRouter
  .route("/:id/update")
  .patch(isLoggedIn, (req, res, next) => {
    if (req.userAuth.role === "staff" && req.userAuth.id === req.params.id) {
      // Staff can update limited fields only
      req.body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      };
      return next();
    } else if (
      req.userAuth.role === "admin" ||
      (
        req.userAuth.role === "staff" &&
        ["Principal", "Vice Principal", "Receptionist"].includes(req.userAuth.position)
      )
    ) {
      return next();
    }else {
      return res.status(403).json({
        status: "failed",
        message:
          "Access Denied. Unauthorized update to staff profile.",
      });
    }
  }, updateStaff);

module.exports = staffRouter;
