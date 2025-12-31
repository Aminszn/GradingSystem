const ExcelService = require("../../db/excelHelpers/service");
const StudentAttempt = require("../models/studentAttempt/studentAttempt");
const StudentAttemptBuilder = require("../models/studentAttempt/studentAttemptBuilder");

/**
 * StudentAttemptService – Business logic layer
 */
class StudentAttemptService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "student_attempts";
    this.modelPrefix = "ATT";
  }

  async getAllAttempts() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => StudentAttempt.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve student attempts: ${error.message}`);
    }
  }

  async getAttemptById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? StudentAttempt.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve student attempt: ${error.message}`);
    }
  }

  async createAttempt(data) {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const attempt = StudentAttemptBuilder.create()
        .setData(cleanData)
        .build();

      const saved = await this.excelService.create(
        this.tableName,
        attempt,
        this.modelPrefix
      );

      if (!saved) {
        throw new Error("Persistence failed");
      };


      return saved ? StudentAttempt.fromExcelRow(saved) : null;
    } catch (error) {
      throw new Error(`Failed to create student attempt: ${error.message}`);
    }
  }

  async updateAttempt(id, updateData) {
    try {
      const existing = await this.getAttemptById(id);
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


      return updated ? StudentAttempt.fromExcelRow(updated) : null;
    } catch (error) {
      throw new Error(`Failed to update student attempt: ${error.message}`);
    }
  }

  async deleteAttempt(id) {
    try {
      const existing = await this.getAttemptById(id);
      if (!existing) return false;

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete student attempt: ${error.message}`);
    }
  }

  async findByExamId(examId) {
    const attempts = await this.getAllAttempts();
    return attempts.filter((a) => a.examId === examId);
  }

  async findByStudentId(studentId) {
    const attempts = await this.getAllAttempts();
    return attempts.filter((a) => a.studentId === studentId);
  }

  async getActiveAttempt(examId, studentId) {
    const attempts = await this.findByExamId(examId);
    return attempts.find(
      (a) =>
        a.examId === examId &&
        a.studentId === studentId &&
        a.status === "IN_PROGRESS"
    ) || null;
  }


  async recordAttempt(examId, studentId) {
    try {
      const attempt = {
        examId,
        studentId,
        startedAt: new Date().toISOString(),
        status: "IN_PROGRESS",
      };
      return await this.createAttempt(attempt);
    } catch (error) {
      throw new Error(`Failed to record student attempt: ${error.message}`);
    }
  }
}

module.exports = StudentAttemptService;
