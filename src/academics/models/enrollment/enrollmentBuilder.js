// src/academics/models/enrollmentBuilder.js  
const Enrollment = require("./enrollment");
const schema = require("./enrollmentSchema");

class EnrollmentBuilder {
  constructor() {
    this.enrollmentData = {};
  }

  setId(id) {
    this.enrollmentData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.enrollmentData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.enrollmentData.updatedAt = updatedAt;
    return this;
  }

  setEnrollmentKey(enrollmentKey) {
    this.enrollmentData.enrollmentKey = enrollmentKey;
    return this;
  }

  setStudentId(studentId) {
    this.enrollmentData.studentId = studentId;
    return this;
  }

  setClassId(classId) {
    this.enrollmentData.classId = classId;
    return this;
  }

  setAcademicYear(academicYear) {
    this.enrollmentData.academicYear = academicYear;
    return this;
  }

  setEnrolledBy(enrolledBy) {
    this.enrollmentData.enrolledBy = enrolledBy;
    return this;
  }

  setEnrolledAt(enrolledAt) {
    this.enrollmentData.enrolledAt = enrolledAt;
    return this;
  }

  setData(data) {
    this.enrollmentData = { ...this.enrollmentData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.enrollmentData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new Enrollment(this.enrollmentData);
  }

  reset() {
    this.enrollmentData = {};
    return this;
  }

  static create() {
    return new EnrollmentBuilder();
  } 
}

module.exports = EnrollmentBuilder;