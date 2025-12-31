// src/academics/models/enrollment.js
const BaseModel = require("../../../models/baseModel");

/**
 * Enrollment Model
 * Bridge between Students and Classes
 */
class Enrollment extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.enrollmentKey = data.enrollmentKey || null; // enrollmentKey
    this.studentId = data.studentId || null;   // FK → Student.id
    this.classId = data.classId || null;       // FK → Class.id
    this.academicYear = data.academicYear || null; // e.g. "2023-2024"
    this.enrolledBy = data.enrolledBy || null; // FK → Staff/Admin.id
    this.enrolledAt = data.enrolledAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      enrollmentKey: this.enrollmentKey,
      studentId: this.studentId,
      classId: this.classId,
      academicYear: this.academicYear,
      enrolledBy: this.enrolledBy,
      enrolledAt: this.enrolledAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new Enrollment({ ...row });
  }
}

module.exports = Enrollment;
