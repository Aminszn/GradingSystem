// ExamQuestion Controller
// Handles incoming requests and responses for exam question operations

const responseStatus = require("../../handlers/responseStatus.handler");
const ExamQuestionService = require("../services/examQuestionService");

const examQuestionService = new ExamQuestionService();

/* =========================
   Create
   ========================= */

const createQuestion = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    if (!examId || !Array.isArray(questions) || questions.length === 0) {
      return responseStatus(
        res,
        400,
        "failed",
        "examId and questions array are required"
      );
    }

    const adminId = req.userAuth?.id || "SYSTEM";

    const result = await examQuestionService.createQuestionsForExam(
      examId,
      questions,
      adminId
    );

    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};


/**
 * Bulk create questions for an exam
 * Expects: { questions: [...] }
 */
const createQuestionsForExam = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const { examId } = req.params;
    const { questions } = req.body;

    const result = await examQuestionService.createQuestionsForExam(
      examId,
      questions,
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

const getAllQuestions = async (req, res) => {
  try {
    const result = await examQuestionService.getAllQuestions();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getQuestionById = async (req, res) => {
  try {
    const result = await examQuestionService.getQuestionById(req.params.id);
    if (!result) {
      return responseStatus(res, 404, "failed", "Exam question not found");
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

const getQuestionsByExamId = async (req, res) => {
  try {
    const result = await examQuestionService.getQuestionsByExamId(
      req.params.examId
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

const updateQuestion = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await examQuestionService.updateQuestion(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(res, 404, "failed", "Exam question not found");
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

const deleteQuestion = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await examQuestionService.deleteQuestion(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(res, 404, "failed", "Exam question not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    
    responseStatus(res, 200, "success", "Exam question deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createQuestion,
  createQuestionsForExam,
  getAllQuestions,
  getQuestionById,
  getQuestionsByExamId,
  updateQuestion,
  deleteQuestion,
};
