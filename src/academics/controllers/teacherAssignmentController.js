// TeacherAssignment Controller
// Handles HTTP requests for teacher–class–subject assignments

const responseStatus = require("../../handlers/responseStatus.handler");
const TeacherAssignmentService = require("../services/teacherAssignmentService");

const teacherAssignmentService = new TeacherAssignmentService();

/* =========================
   Create
   ========================= */

const createAssignment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await teacherAssignmentService.createAssignment(
      req.body,
      adminId
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/* =========================
   Read
   ========================= */

const getAllAssignments = async (req, res) => {
  try {
    const result = await teacherAssignmentService.getAllAssignments();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const result = await teacherAssignmentService.getAssignmentById(
      req.params.id
    );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Teacher assignment not found"
      );
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

/* =========================
   Update
   ========================= */

const updateAssignment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await teacherAssignmentService.updateAssignment(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Teacher assignment not found"
      );
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

/* =========================
   Delete
   ========================= */

const deleteAssignment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await teacherAssignmentService.deleteAssignment(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(
        res,
        404,
        "failed",
        "Teacher assignment not found"
      );
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(
      res,
      200,
      "success",
      "Teacher assignment deleted successfully"
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/* =========================
   Filters
   ========================= */

const getAssignmentsByEmployeeId = async (req, res) => {
  try {
    const result = await teacherAssignmentService.findByEmployeeId(
      req.params.employeeId
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getAssignmentsByClassId = async (req, res) => {
  try {
    const result = await teacherAssignmentService.findByClassId(
      req.params.classId
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getAssignmentsBySubjectId = async (req, res) => {
  try {
    const result = await teacherAssignmentService.findBySubjectId(
      req.params.subjectId
    );

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
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByEmployeeId,
  getAssignmentsByClassId,
  getAssignmentsBySubjectId,
};
