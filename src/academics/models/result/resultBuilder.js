// src/academics/models/resultBuilder.js
const Result = require("./result");
const schema = require("./resultSchema");

class ResultBuilder {
  constructor() {
    this.resultData = {};
  }

  setId(id) {
    this.resultData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.resultData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.resultData.updatedAt = updatedAt;
    return this;
  }

  setStudentId(studentId) {
    this.resultData.studentId = studentId;
    return this;
  }

  setExamId(examId) {
    this.resultData.examId = examId;
    return this;
  }

  setScore(score) {
    this.resultData.score = score;
    return this;
  }

  setGrade(grade) {
    this.resultData.grade = grade;
    return this;
  }

  setRecordedAt(recordedAt) {
    this.resultData.recordedAt = recordedAt;
    return this;
  }

  setData(data) {
    this.resultData = { ...this.resultData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.resultData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new Result(this.resultData);
  }

  reset() {
    this.resultData = {};
    return this;
  }

  static create() {
    return new ResultBuilder();
  } 
}

module.exports = ResultBuilder;