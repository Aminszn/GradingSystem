const express = require("express");
const { createStudent, getStudentById, updateStudent, deleteStudent, getAllStudents } = require("../../students/controllers/studentController");

// Middleware
const isLoggedIn = require("../../middlewares/isLoggedin");
const {authorizeRole, authorizePosition} = require("../../middlewares/authorize");


const studentsRouter = express.Router();

// Admin Only Routes to manage students
studentsRouter.route('/register').post (isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), createStudent);
studentsRouter.route('/:id').delete (isLoggedIn, authorizeRole(["admin", "staff"]), authorizePosition(["Principal", "Vice Principal", "Receptionist"]), deleteStudent);
studentsRouter.route('/getAll').get (isLoggedIn, authorizeRole(["admin"]), getAllStudents);

// Student (self) or staff Admin/Teacher Routes
studentsRouter.route('/:id/profile').get (isLoggedIn, authorizeRole(["admin", "staff", "student"]), getStudentById);

// Update: Student limited, Admin/Teacher full
studentsRouter.route('/:id/update').patch (isLoggedIn, (req, res, next) => {
  if (req.userAuth.role === 'student' && req.userAuth.id === req.params.id) {
    // Student can only update limited fields
    req.body = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
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
  } else {
    return res.status(403).json({ status: 'failed', message: 'Access Denied. Unauthorized update to student profile.' });
  }
}, updateStudent);

module.exports = studentsRouter;
  