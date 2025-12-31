// src/academics/models/studentAttempt.js
const BaseModel = require("../../../models/baseModel");

/**
 * StudentAttempt Model
 * Represents a student's attempt at an exam.
 */
class StudentAttempt extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.examId = data.examId || null;           // ID of the exam
    this.studentId = data.studentId || null;     // ID of the student
    this.startedAt = data.startedAt || null;     // Timestamp when the attempt started
    this.submittedAt = data.submittedAt || null; // Timestamp when the attempt was submitted
    this.status = data.status || "IN_PROGRESS";   // Status of the attempt (IN_PROGRESS | SUBMITTED | GRADED)
  }

  toJSON() {
    return {
      id: this.id,
      examId: this.examId,
      studentId: this.studentId,
      startedAt: this.startedAt,
      submittedAt: this.submittedAt,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new StudentAttempt({ ...row });
  }
}

module.exports = StudentAttempt;

// Key fields

// id

// examId

// studentId

// startedAt

// submittedAt

// status (IN_PROGRESS | SUBMITTED | GRADED)