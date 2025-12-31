// Exam Controller
// Handles incoming requests and responses for exam-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const ExamService = require("../services/examService");

const examService = new ExamService();

/* =========================
   Create
   ========================= */

const createExam = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await examService.createExam(req.body, adminId);

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

const getAllExams = async (req, res) => {
  try {
    const result = await examService.getAllExams();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getExamById = async (req, res) => {
  try {
    const result = await examService.getExamById(req.params.id);
    if (!result) {
      return responseStatus(res, 404, "failed", "Exam not found");
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

const findExamsByClassId = async (req, res) => {
  try {
    const result = await examService.findByClassId(req.params.classId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const findExamsBySubjectId = async (req, res) => {
  try {
    const result = await examService.findBySubjectId(req.params.subjectId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const findExamsByStatus = async (req, res) => {
  try {
    const result = await examService.findByStatus(req.params.status);

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

const updateExam = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await examService.updateExam(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(res, 404, "failed", "Exam not found");
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

const deleteExam = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await examService.deleteExam(req.params.id, adminId);

    if (!deleted) {
      return responseStatus(res, 404, "failed", "Exam not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", "Exam deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/* =========================
   Student actions
   ========================= */

/**
 * Start an exam (student-facing)
 */
const startExam = async (req, res) => {
  try {
    const studentId = req.userAuth?.id;
    const result = await examService.startExam(
      req.params.examId,
      studentId
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

/**
 * Submit an exam (student-facing)
 */
const submitExam = async (req, res) => {
  try {
    const studentId = req.userAuth?.id;
    const result = await examService.submit(
      req.params.examId,
      studentId
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
  createExam,
  getAllExams,
  getExamById,
  findExamsByClassId,
  findExamsBySubjectId,
  findExamsByStatus,
  updateExam,
  deleteExam,
  startExam,
  submitExam,
};
