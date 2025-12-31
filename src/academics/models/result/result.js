// src/academics/models/result.js
const BaseModel = require("../../../models/baseModel");

/**
 * Result Model
 * Stores exam/test results for a student in a subject and class
 */
class Result extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.examId = data.examId || null; // FK → Exam.id
    this.studentId = data.studentId || null; // FK → Student.id
    this.score = data.score || 0;
    this.grade = data.grade || null; // e.g. A, B, C
    this.recordedAt = data.recordedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      studentId: this.studentId,
      examId: this.examId,
      score: this.score,
      grade: this.grade,
      recordedAt: this.recordedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new Result({ ...row });
  }
}

module.exports = Result;
