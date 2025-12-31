const ExcelService = require("../../db/excelHelpers/service");
const StudentAnswer = require("../models/studentAnswer/studentAnswer");
const StudentAnswerBuilder = require("../models/studentAnswer/studentAnswerBuilder");
const StudentAttemptService = require("./studentAttemptService");

/**
 * StudentAnswerService – Business logic layer
 */
class StudentAnswerService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "student_answers";
    this.modelPrefix = "ANS";
    this.studentAttemptService = new StudentAttemptService();
  }

  async getAllAnswers() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => StudentAnswer.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve student answers: ${error.message}`);
    }
  }

  async getAnswerById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? StudentAnswer.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve student answer: ${error.message}`);
    }
  }

  async createAnswer(data) {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const answer = StudentAnswerBuilder.create()
        .setData(cleanData)
        .build();

      const saved = await this.excelService.create(
        this.tableName,
        answer,
        this.modelPrefix
      );

      if (!saved) {
        throw new Error("Persistence failed");
      };


      return saved ? StudentAnswer.fromExcelRow(saved) : null;
    } catch (error) {
      throw new Error(`Failed to create student answer: ${error.message}`);
    }
  }

  async updateAnswer(id, updateData) {
    try {
      const existing = await this.getAnswerById(id);
      if (!existing) return null;

      const { id: _, createdAt, updatedAt, ...cleanUpdateData } = updateData;

      const updated = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!updated) {
        throw new Error("Persistence failed");
      };


      return updated ? StudentAnswer.fromExcelRow(updated) : null;
    } catch (error) {
      throw new Error(`Failed to update student answer: ${error.message}`);
    }
  }

  async gradeAnswer(answerId, { isCorrect, marksAwarded }) {
    try {
      return await this.updateAnswer(answerId, {
        isCorrect,
        marksAwarded,
      });
    } catch (error) {
      throw new Error(
        `Failed to grade student answer: ${error.message}`
      );
    }
  }

  async deleteAnswer(id) {
    try {
      const existing = await this.getAnswerById(id);
      if (!existing) return false;

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete student answer: ${error.message}`);
    }
  }

  async findByExamId(examId) {
    const answers = await this.getAllAnswers();
    return answers.filter((a) => a.examId === examId);
  }

  async findByStudentId(studentId) {
    const answers = await this.getAllAnswers();
    return answers.filter((a) => a.studentId === studentId);
  }

  async findByExamAndStudent(examId, studentId) {
  const answers = await this.getAllAnswers();
  return answers.filter(
    (a) => a.examId === examId && a.studentId === studentId
  );
}

async upsertAnswer({ examId, studentId, questionId, selectedOptionIndex }) {
  try {
    const attempt =
      await this.studentAttemptService.getActiveAttempt(examId, studentId);

    if (!attempt) {
      throw new Error("No active exam attempt found.");
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw new Error("Cannot modify answers after submission.");
    }

    const answers =
      await this.findByExamAndStudent(examId, studentId);

    const existing = answers.find(
      (a) => a.questionId === questionId
    );

    if (existing) {
      return await this.updateAnswer(existing.id, {
        selectedOptionIndex,
      });
    }

    return await this.createAnswer({
      examId,
      studentId,
      questionId,
      selectedOptionIndex,
      isCorrect: null, 
    });
  } catch (error) {
    throw new Error(`Failed to upsert student answer: ${error.message}`);
  }
}


}

module.exports = StudentAnswerService;
