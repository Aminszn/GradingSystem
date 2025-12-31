// Result Controller
// Handles incoming requests and responses for result-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const ResultService = require("../services/resultService");

const resultService = new ResultService();

/* =========================
   Read
   ========================= */

const getAllResults = async (req, res) => {
  try {
    const result = await resultService.getAllResults();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await resultService.getResultById(req.params.id);

    if (!result) {
      return responseStatus(res, 404, "failed", "Result not found");
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

const getResultsByStudentId = async (req, res) => {
  try {
    const result = await resultService.findByStudentId(
      req.params.studentId
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

const getResultsByExamId = async (req, res) => {
  try {
    const result = await resultService.findByExamId(req.params.examId);

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
   Generate (Business Action)
   ========================= */

const generateResult = async (req, res) => {
  try {
    const adminId = req.userAuth?.id || "SYSTEM";
    const { examId, studentId } = req.body;

    if (!examId || !studentId) {
      return responseStatus(
        res,
        400,
        "failed",
        "examId and studentId are required"
      );
    }

    const result = await resultService.generateResult(
      examId,
      studentId,
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

module.exports = {
  getAllResults,
  getResultById,
  getResultsByStudentId,
  getResultsByExamId,
  generateResult,
};
