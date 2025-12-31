const responseStatus = require("../../handlers/responseStatus.handler");
const StudentAnswerService = require("../services/studentAnswerService");

const studentAnswerService = new StudentAnswerService();

/* =========================
   Save / Update Answer
   ========================= */
// POST /api/v1/academics/exams/:examId/answers

const saveAnswer = async (req, res) => {
  try {
    const studentId = req.userAuth.id;
    const { examId } = req.params;
    const { questionId, selectedOptionIndex } = req.body;

    if (!questionId || selectedOptionIndex === undefined) {
      return responseStatus(
        res,
        400,
        "failed",
        "questionId and selectedOptionIndex are required"
      );
    }

    const result = await studentAnswerService.upsertAnswer({
      examId,
      studentId,
      questionId,
      selectedOptionIndex,
    });

    // Debug logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = { saveAnswer };
