const ExcelService = require("../../db/excelHelpers/service");
const Exam = require("../models/exam/exam");
const ExamBuilder = require("../models/exam/examBuilder");
const StudentAnswerService = require("./studentAnswerService");
const StudentAttemptService = require("./studentAttemptService");
const ExamQuestionService = require("./examQuestionService");
const AdminActionService = require("../../system/services/adminActionService");
const ResultService = require("./resultService");
const EnrollmentService = require("../../academics/services/enrollmentService")

const adminActionService = new AdminActionService();
const examQuestionService = new ExamQuestionService();
const studentAnswerService = new StudentAnswerService();
const studentAttemptService = new StudentAttemptService();
const resultService = new ResultService();
const enrollmentService = new EnrollmentService();
/**
 * ExamService – Business logic layer
 */
class ExamService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "exams";
    this.modelPrefix = "EXM";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllExams() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => Exam.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve exams: ${error.message}`);
    }
  }

  async getExamById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? Exam.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve exam: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createExam(data, adminId = "SYSTEM") {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const exam = ExamBuilder.create()
        .setData(cleanData)
        .build();

      const result = await this.excelService.create(
        this.tableName,
        exam,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Persistence failed");
      };

      if (result) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "create",
          entityType: "exam",
          entityId: result.id,
        });
      }

      return result ? Exam.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create exam: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateExam(id, updateData, adminId = "SYSTEM") {
    try {
      const existing = await this.getExamById(id);
      if (!existing) return null;

      const { id: _, createdAt, updatedAt, ...cleanUpdateData } = updateData;

      const result = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!result) {
        throw new Error("Persistence failed");
      };


      if (result) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "update",
          entityType: "exam",
          entityId: result.id,
        });
      }

      return result ? Exam.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update exam: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteExam(id, adminId = "SYSTEM") {
    try {
      const existing = await this.getExamById(id);
      if (!existing) return false;

      if (existing) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "delete",
          entityType: "exam",
          entityId: existing.id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete exam: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findByClassId(classId) {
    const exams = await this.getAllExams();
    return exams.filter((e) => e.classId === classId);
  }

  async findBySubjectId(subjectId) {
    const exams = await this.getAllExams();
    return exams.filter((e) => e.subjectId === subjectId);
  }

  async findByStatus(status) {
    const exams = await this.getAllExams();
    return exams.filter((e) => e.status === status);
  }

  /* =========================
     Other usecases
     ========================= */

  async startExam(examId, studentId) {
    try {
      const exam = await this.getExamById(examId);
      if (!exam) throw new Error("Exam not found.");

      console.log("RAW EXAM:", exam);
      console.log("END AT RAW:", exam.endAt);
      console.log("END AT PARSED:", new Date(exam.endAt).toISOString());
      console.log("NOW:", new Date().toISOString());




      if (exam.status !== "PUBLISHED") {
        throw new Error("Exam is not available.");
      }

      const now = Date.now();

      let startAtValue = exam.startAt;
      let endAtValue = exam.endAt;

      // Excel serial date handling
      if (typeof startAtValue === "number") {
        startAtValue = new Date((startAtValue - 25569) * 86400 * 1000);
      }
      if (typeof endAtValue === "number") {
        endAtValue = new Date((endAtValue - 25569) * 86400 * 1000);
      }

      const startAt = new Date(startAtValue).getTime();
      const endAt = new Date(endAtValue).getTime();

      if (Number.isNaN(startAt) || Number.isNaN(endAt)) {
        throw new Error("Invalid exam time window.");
      }

      if (startAt > now) {
        throw new Error("Exam has not started yet.");
      }

      if (endAt <= now) {
        throw new Error("Exam has already ended.");
      }


      // Enrollment validation
      const enrollment =
        await enrollmentService.findByStudentAndYear(
          studentId,
          exam.academicYear // or inferred current year
        );

      if (!enrollment || enrollment.classId !== exam.classId) {
        throw new Error("Student is not enrolled for this exam");
      }

      const questions =
        await examQuestionService.getQuestionsByExamId(examId);

      if (!questions.length) {
        throw new Error("Exam has no questions.");
      }

      let attempt =
        await studentAttemptService.getActiveAttempt(examId, studentId);

      if (!attempt) {
        attempt = await studentAttemptService.recordAttempt(
          examId,
          studentId
        );

        await adminActionService.log({
          actorId: studentId,
          action: "start",
          entityType: "exam",
          entityId: examId,
        });
      }

      const answers =
        await studentAnswerService.findByExamAndStudent(
          examId,
          studentId
        );

      return {
        exam,
        questions,
        answers,
      };
    } catch (error) {
      throw new Error(`Failed to start exam: ${error.message}`);
    }
  }
  


  async submit(examId, studentId) {
    try {
      const exam = await this.getExamById(examId);
      if (!exam) throw new Error("Exam not found.");

      const attempt =
        await studentAttemptService.getActiveAttempt(
          examId,
          studentId
        );

      if (!attempt) {
        throw new Error("No active attempt found.");
      }

      await studentAttemptService.updateAttempt(attempt.id, {
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
      });

      await resultService.generateResult(examId, studentId, studentId);

      await adminActionService.log({
        actorId: studentId,
        action: "submit",
        entityType: "exam",
        entityId: examId,
      });

      return {
        message: "Exam submitted successfully.",
      };
    } catch (error) {
      throw new Error(`Failed to submit exam: ${error.message}`);
    }
  }

}

module.exports = ExamService;
