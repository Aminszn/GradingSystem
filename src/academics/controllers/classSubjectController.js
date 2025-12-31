// ClassSubject Controller
// Handles incoming requests and responses for class-subject assignment operations

const responseStatus = require("../../handlers/responseStatus.handler");
const ClassSubjectService = require("../services/classSubjectService");

const classSubjectService = new ClassSubjectService();

/* =========================
   Create
   ========================= */

const createAssignment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await classSubjectService.createAssignment(
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
    const result = await classSubjectService.getAllAssignments();

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
    const result = await classSubjectService.getAssignmentById(req.params.id);
    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Class-subject assignment not found"
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
   Filters
   ========================= */

const findAssignmentsByClassId = async (req, res) => {
  try {
    const result = await classSubjectService.findByClassId(req.params.classId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const findAssignmentsByAcademicYear = async (req, res) => {
  try {
    const result = await classSubjectService.findByAcademicYear(
      req.params.academicYear
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

/* =========================
   Update
   ========================= */

const updateAssignment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await classSubjectService.updateAssignment(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Class-subject assignment not found"
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
    const deleted = await classSubjectService.deleteAssignment(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(
        res,
        404,
        "failed",
        "Class-subject assignment not found"
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
      "Class-subject assignment deleted successfully"
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  findAssignmentsByClassId,
  findAssignmentsByAcademicYear,
  updateAssignment,
  deleteAssignment,
};
