// Performs simple CRUD operations
const ExcelService = require("../../db/excelHelpers/service");
const ExamQuestion = require("../models/examQuestion/examQuestion");
const ExamQuestionBuilder = require("../models/examQuestion/examQuestionBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();
/**
 * ExamQuestionService – Business logic layer
 */
class ExamQuestionService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "exam_questions";
    this.modelPrefix = "EXQ";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllQuestions() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => ExamQuestion.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve exam questions: ${error.message}`);
    }
  }

  async getQuestionById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? ExamQuestion.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve exam question: ${error.message}`);
    }
  }

  async getQuestionsByExamId(examId) {
    try {
      const questions = await this.getAllQuestions();
      return questions.filter((q) => q.examId === examId);
    } catch (error) {
      throw new Error(
        `Failed to retrieve questions for exam ${examId}: ${error.message}`
      );
    }
  }

  /* =========================
     Create operations
     ========================= */

  async createQuestion(questionData) {
    try {
      // Strip system-managed fields
      const { id, createdAt, updatedAt, ...cleanData } = questionData;

      const question = ExamQuestionBuilder.create()
        .setData(cleanData)
        .build();

      // Serialize options for Excel storage
      const row = question.toJSON();
      row.options = JSON.stringify(row.options);

      const result = await this.excelService.create(
        this.tableName,
        row,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Persistence failed");
      };


      return result ? ExamQuestion.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create exam question: ${error.message}`);
    }
  }

  /**
   * Bulk create questions for an exam
   */
  async createQuestionsForExam(examId, questionsArray, adminId = "SYSTEM") {
    try {
      const createdQuestions = [];

      for (const q of questionsArray) {
        const question = await this.createQuestion({
          ...q,
          examId,
        });

        if (question) {
          createdQuestions.push(question);
        }
      }
      
      if (createdQuestions.length > 0) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "create",
          entityType: "exam_questions",
          entityId: examId,
          metadata: {
            scope: "exam",
            count: createdQuestions.length,
          },
        }); 
      }

      return createdQuestions;
    } catch (error) {
      throw new Error(
        `Failed to create exam questions: ${error.message}`
      );
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateQuestion(id, updateData, adminId = "SYSTEM") {
    try {
      const existingQuestion = await this.getQuestionById(id);
      if (!existingQuestion) {
        return null;
      }

      // Remove system-managed fields
      const { id: dataId, createdAt, updatedAt, ...cleanUpdateData } =
        updateData;

      // Serialize options if present
      if (Array.isArray(cleanUpdateData.options)) {
        cleanUpdateData.options = JSON.stringify(cleanUpdateData.options);
      }

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
        entityType: "exam_question",
        entityId: result.id,
      });
      }

      return result ? ExamQuestion.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update exam question: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteQuestion(id, adminId = "SYSTEM") {
    try {
      const existingQuestion = await this.getQuestionById(id);
      if (!existingQuestion) return false;

      if (existingQuestion) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
        action: "delete",
        entityType: "exam_question",
        entityId: existingQuestion.id,
      });
      }
      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete exam question: ${error.message}`);
    }
  }
}

module.exports = ExamQuestionService;
