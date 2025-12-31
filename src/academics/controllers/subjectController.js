// Subject Controller
// Handles incoming requests and responses for subject-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const SubjectService = require("../services/subjectService");

const subjectService = new SubjectService();

/* =========================
   Create
   ========================= */

const createSubject = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await subjectService.createSubject(req.body, adminId);

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

const getAllSubjects = async (req, res) => {
  try {
    const result = await subjectService.getAllSubjects();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getSubjectById = async (req, res) => {
  try {
    const result = await subjectService.getSubjectById(req.params.id);

    if (!result) {
      return responseStatus(res, 404, "failed", "Subject not found");
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

const findSubjectsByLevel = async (req, res) => {
  try {
    const result = await subjectService.findSubjectsByLevel(
      req.params.level
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

const updateSubject = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await subjectService.updateSubject(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(res, 404, "failed", "Subject not found");
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

const deleteSubject = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await subjectService.deleteSubject(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(res, 404, "failed", "Subject not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    
    responseStatus(res, 200, "success", "Subject deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  findSubjectsByLevel,
  updateSubject,
  deleteSubject,
};
