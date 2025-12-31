const ExamBuilder = require("../../src/academics/models/exam/examBuilder");
const ExamService = require("../../src/academics/services/examService");
const ExamQuestionBuilder = require("../../src/academics/models/examQuestion/examQuestionBuilder");
const ExamQuestionService = require("../../src/academics/services/examQuestionService");
const StudentAttemptBuilder = require("../../src/academics/models/studentAttempt/studentAttemptBuilder");
const StudentAttemptService = require("../../src/academics/services/studentAttemptService");
const StudentAnswerBuilder = require("../../src/academics/models/studentAnswer/studentAnswerBuilder");
const StudentAnswerService = require("../../src/academics/services/studentAnswerService");
const ResultBuilder = require("../../src/academics/models/result/resultBuilder");
const ResultService = require("../../src/academics/services/resultService");

const examService = new ExamService();
const examQuestionService = new ExamQuestionService();
const studentAttemptService = new StudentAttemptService();
const studentAnswerService = new StudentAnswerService();
const resultService = new ResultService();

const ADMIN_ID = "ADM001";
const STUDENT_ID = "STD001";

// Test Exam Model Creation
console.log("\nTesting Exam Builder...");
try {
  const exam = new ExamBuilder()
    .setEmployeeId(ADMIN_ID)
    .setTitle("Math Test")
    .setClassId("CLS001")
    .setSubjectId("SUB001")
    .setAcademicYear("2024/2025")
    .setTerm("First Term")
    .setDuration(60)
    .setTotalMarks(100)
    .setStatus("PUBLISHED")
    .setStartAt(new Date())
    .setEndAt(new Date(Date.now() + 60 * 60 * 1000))
    .build();
  console.log("Exam Builder Success:", exam);
} catch (error) {
  console.error("Exam Builder Failed:", error.message);
}

// Sequential async tests to ensure dependencies are resolved
(async () => {
  console.log("\nTesting Exam Service...");
  try {
    const createdExam = await examService.createExam(
      {
        employeeId: ADMIN_ID,
        title: "Math Test",
        classId: "CLS001",
        subjectId: "SUB001",
        academicYear: "2024/2025",
        term: "First Term",
        duration: 60,
        totalMarks: 100,
        status: "PUBLISHED",
        startAt: new Date(),
        endAt: new Date(Date.now() + 60 * 60 * 1000),
      },
      ADMIN_ID
    );
    console.log("Exam Created:", createdExam);
    global.EXAM_ID = createdExam.id;
    const fetched = await examService.getExamById(createdExam.id);
    console.log("Exam Retrieved:", fetched);
  } catch (error) {
    console.error("Exam Service Failed:", error.message);
    return; // Exit early if exam creation fails
  }

  console.log("\nTesting ExamQuestion...");
  try {
    const question = new ExamQuestionBuilder()
      .setExamId(global.EXAM_ID)
      .setQuestionText("2 + 2 = ?")
      .setOptions(["1", "2", "3", "4"])
      .setCorrectOption(3)
      .setMarks(5)
      .build();
    console.log("Question Builder Success:", question);
    const saved = await examQuestionService.createQuestion(question);
    console.log("Question Saved:", saved);
    global.QUESTION_ID = saved.id;
  } catch (error) {
    console.error("ExamQuestion Failed:", error.message);
    return; // Exit early if question creation fails
  }

  console.log("\nTesting StudentAttempt...");
  try {
    const attempt = new StudentAttemptBuilder()
      .setExamId(global.EXAM_ID)
      .setStudentId(STUDENT_ID)
      .setStatus("IN_PROGRESS")
      .setStartedAt(new Date())
      .build();
    console.log("Attempt Builder Success:", attempt);
    const attemptData = {
      examId: global.EXAM_ID,
      studentId: STUDENT_ID,
      status: "IN_PROGRESS",
      startedAt: new Date()
    };
    const saved = await studentAttemptService.createAttempt(attemptData);
    console.log("Attempt Saved:", saved);
    const active = await studentAttemptService.getAttemptById(saved.id);
    console.log("Active Attempt:", active);
    global.ATTEMPT_ID = active.id;
  } catch (error) {
    console.error("StudentAttempt Failed:", error.message);
    return; // Exit early if attempt creation fails
  }

  console.log("\nTesting StudentAnswer...");
  try {
    const answer = new StudentAnswerBuilder()
      .setExamId(global.EXAM_ID)
      .setStudentId(STUDENT_ID)
      .setQuestionId(global.QUESTION_ID)
      .setSelectedOptionIndex(3)
      .setIsCorrect(true)
      .setMarksAwarded(5)
      .build();
    console.log("Answer Builder Success:", answer);
    const saved = await studentAnswerService.createAnswer(answer);
    console.log("Answer Saved:", saved);
    const answers =
      await studentAnswerService.findByExamAndStudent(
        global.EXAM_ID,
        STUDENT_ID
      );
    console.log("Answers Retrieved:", answers);
  } catch (error) {
    console.error("StudentAnswer Failed:", error.message);
    return; // Exit early if answer creation fails
  }

  console.log("\nTesting Result...");
  try {
    const result = new ResultBuilder()
      .setExamId(global.EXAM_ID)
      .setStudentId(STUDENT_ID)
      .setScore(5)
      .setGrade("A")
      .setRecordedAt(new Date())
      .build();
    console.log("Result Builder Success:", result);
    const saved = await resultService.createResult(result);
    console.log("Result Saved:", saved);
  } catch (error) {
    console.error("Result Failed:", error.message);
  }
})();