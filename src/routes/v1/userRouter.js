const express = require("express");
const {
  login,
  changePassword,
  registerUserController,
} = require("../../users/controllers/userController");

// Middleware
const isLoggedIn = require("../../middlewares/isLoggedin");
const {authorizeRole , authorizePosition} = require("../../middlewares/authorize");

const userRouter = express.Router();

// Public Routes
// Only admins can register new users but not here only after student/staff is created in the system. so its the userService that is called in the domain layer that creates the user with default password.
userRouter.route("/register").post(isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), registerUserController);

userRouter.route("/login").post(login);
userRouter.route("/change-password").put(isLoggedIn, changePassword);

// Protected Routes
// userRouter
//   .route("/profile")
//   .get(isLoggedIn, getUserProfileController)
//   .patch(isLoggedIn, updateUserProfileController);

module.exports = userRouter;