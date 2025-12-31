// src/admissions/models/admission.js
const BaseModel = require("../../../models/baseModel");

/**
 * Admission Model
 * Represents a student's initial admission into the school.
 * Immutable intake record.
 */
class Admission extends BaseModel {
  constructor(data = {}) {
    super(data);

    // Student bio at intake
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.email = data.email || null;
    this.phoneNumber = data.phoneNumber || null;
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || null;

    // Guardian info
    this.parentName = data.parentName || null;
    this.parentPhone = data.parentPhone || null;
    this.address = data.address || null;

    // Admission-specific
    this.academicYear = data.academicYear || null;
    this.entryClassLevel = data.entryClassLevel || null;
    this.admissionDate = data.admissionDate || null;
    this.schoolCode = data.schoolCode || null;


    // Identity
    this.studentNumber = data.studentNumber || null;
    this.status = data.status || "admitted";
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      parentName: this.parentName,
      parentPhone: this.parentPhone,
      address: this.address,
      academicYear: this.academicYear,
      entryClassLevel: this.entryClassLevel,
      admissionDate: this.admissionDate,
      studentNumber: this.studentNumber,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new Admission({ ...row });
  }
}

module.exports = Admission;
