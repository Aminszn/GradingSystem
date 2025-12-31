// Student Controller
// Handles incoming requests and responses for student-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const studentService = require('../services/studentService');

const service = new studentService();


const createStudent = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    const result = await service.createStudent(req.body, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getStudentById = async (req, res) => {
  try {
    const result = await service.getStudentById(req.params.id);
    if (!result) {
      return responseStatus(res, 404, "failed", "Student not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const updateStudent = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    const result = await service.updateStudent(req.params.id, req.body, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    await service.deleteStudent(req.params.id, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", "Student deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await service.getAllStudents();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllStudents
};
