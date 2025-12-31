// src/academics/models/studentAttemptBuilder.js
const StudentAttempt = require("./studentAttempt");
const schema = require('./studentAttemptSchema');

class StudentAttemptBuilder {
  constructor() {
    this.studentAttemptData = {};
  }

  setId(id) {
    this.studentAttemptData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.studentAttemptData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.studentAttemptData.updatedAt = updatedAt;
    return this;
  }
  
  setExamId(examId) {
    this.studentAttemptData.examId = examId;
    return this;
  }
  setStudentId(studentId) {
    this.studentAttemptData.studentId = studentId;
    return this;
  }

  setStartedAt(startedAt) {
    this.studentAttemptData.startedAt = startedAt;
    return this;
  }

  setSubmittedAt(submittedAt) {
    this.studentAttemptData.submittedAt = submittedAt;
    return this;
  }

  setStatus(status) {
    this.studentAttemptData.status = status;
    return this;
  }

  setData(data) {
    this.studentAttemptData = { ...this.studentAttemptData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.studentAttemptData); 
    if (error) {
      throw new Error(`Invalid StudentAttempt data: ${error.details.map(x => x.message).join(', ')}`);
    }
    return new StudentAttempt(this.studentAttemptData);
  }

  reset() {
    this.studentAttemptData = {};
    return this;
  }

  static create() {
    return new StudentAttemptBuilder();
  }
}

module.exports = StudentAttemptBuilder;