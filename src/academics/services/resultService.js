const ExcelService = require("../../db/excelHelpers/service");
const Result = require("../models/result/result");
const ResultBuilder = require("../models/result/resultBuilder");

const StudentAttemptService = require("./studentAttemptService");
const StudentAnswerService = require("./studentAnswerService");
const ExamQuestionService = require("./examQuestionService");
const AdminActionService = require("../../system/services/adminActionService");

const studentAttemptService = new StudentAttemptService();
const studentAnswerService = new StudentAnswerService();
const examQuestionService = new ExamQuestionService();
const adminActionService = new AdminActionService();

/**
 * ResultService – Business logic layer
 */
class ResultService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "results";
    this.modelPrefix = "RST";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllResults() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => Result.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve results: ${error.message}`);
    }
  }

  async getResultById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? Result.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve result: ${error.message}`);
    }
  }

  async findByStudentId(studentId) {
    const results = await this.getAllResults();
    return results.filter((r) => r.studentId === studentId);
  }

  async findByExamId(examId) {
    const results = await this.getAllResults();
    return results.filter((r) => r.examId === examId);
  }

  /* =========================
     Create / Update
     ========================= */

  async createResult(data, adminId = "SYSTEM") {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const result = ResultBuilder.create()
        .setData(cleanData)
        .build();

      const saved = await this.excelService.create(
        this.tableName,
        result,
        this.modelPrefix
      );

      if (!saved) {
        throw new Error("Persistence failed");
      }

      await adminActionService.log({
        actorId: adminId,
        action: "create",
        entityType: "result",
        entityId: saved.id,
      });

      return Result.fromExcelRow(saved);
    } catch (error) {
      throw new Error(`Failed to create result: ${error.message}`);
    }
  }

  async updateResult(id, updateData, adminId = "SYSTEM") {
    try {
      const existing = await this.getResultById(id);
      if (!existing) return null;

      const { id: _, createdAt, updatedAt, ...cleanUpdateData } = updateData;

      const updated = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!updated) {
        throw new Error("Persistence failed");
      }

      await adminActionService.log({
        actorId: adminId,
        action: "update",
        entityType: "result",
        entityId: updated.id,
      });

      return Result.fromExcelRow(updated);
    } catch (error) {
      throw new Error(`Failed to update result: ${error.message}`);
    }
  }

  /* =========================
     Result computation
     ========================= */

  async generateResult(examId, studentId, adminId = "SYSTEM") {
    try {
      /* =========================
         1. Validate submitted attempt
         ========================= */

      const attempts =
        await studentAttemptService.findByExamId(examId);

      const attempt = attempts.find(
        (a) =>
          a.examId === examId &&
          a.studentId === studentId &&
          a.status === "SUBMITTED"
      );

      if (!attempt) {
        throw new Error("No exam attempt found for student.");
      }

      /* =========================
         2. Load questions & answers
         ========================= */

      const questions =
        await examQuestionService.getQuestionsByExamId(examId);

      if (!questions.length) {
        throw new Error("Exam has no questions.");
      }

      const answers =
        await studentAnswerService.findByExamAndStudent(
          examId,
          studentId
        );

      /* =========================
         3. Grade (MCQ)
         ========================= */

      let score = 0;

      for (const question of questions) {
        const answer = answers.find(
          (a) => a.questionId === question.id
        );

        if(!answer) continue;

        const isCorrect = answer.selectedOptionIndex === question.correctOption;

        const marksAwarded = isCorrect ? 2 : 0;

        if (isCorrect) {
          score += marksAwarded;
        }

        await studentAnswerService.gradeAnswer(answer.id, {
          isCorrect,
          marksAwarded,
        });
      }

      /* =========================
         4. Grade assignment
         ========================= */

      const totalMarks = questions.reduce(
        (sum, q) => sum + q.marks,
        0
      );

      const percentage = (score / totalMarks) * 100;

      let grade = "F";
      if (percentage >= 70) grade = "A";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 45) grade = "D";

      /* =========================
         5. Upsert result
         ========================= */

      const existingResult = (
        await this.findByStudentId(studentId)
      ).find((r) => r.examId === examId);

      let result;

      if (existingResult) {
        result = await this.updateResult(
          existingResult.id,
          {
            score,
            grade,
            recordedAt: new Date().toISOString(),
          },
          adminId
        );
      } else {
        result = await this.createResult(
          {
            examId,
            studentId,
            score,
            grade,
            recordedAt: new Date().toISOString(),
          },
          adminId
        );
      }

      /* =========================
         6. Finalize attempt
         ========================= */

      await studentAttemptService.updateAttempt(attempt.id, {
        status: "GRADED",
        gradedAt: new Date().toISOString(),
      });

      await adminActionService.log({
        actorId: adminId,
        action: "generate",
        entityType: "result",
        entityId: result.id,
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to generate result: ${error.message}`);
    }
  }
}

module.exports = ResultService;
