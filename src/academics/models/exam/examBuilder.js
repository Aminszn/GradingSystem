// src/academics/models/examBuilder.js
const Exam = require("./exam");
const schema = require("./examSchema");

class ExamBuilder {
  constructor() {
    this.examData = {};
  }

  setId(id) {
    this.examData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.examData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.examData.updatedAt = updatedAt;
    return this;
  }

  setEmployeeId(employeeId) {
    this.examData.employeeId = employeeId;
    return this;
  } 

  setClassId(classId) {
    this.examData.classId = classId;
    return this;
  }

  setSubjectId(subjectId) {
    this.examData.subjectId = subjectId;
    return this;
  }

  setTitle(title) {
    this.examData.title = title;
    return this;
  }

  setInstructions(instructions) {
    this.examData.instructions = instructions;
    return this;
  }

  setDuration(duration) {
    this.examData.duration = duration;
    return this;
  }

  setAcademicYear(academicYear) {
    this.examData.academicYear = academicYear;
    return this;
  }

  setTerm(term) {
    this.examData.term = term;
    return this;
  }

  setStartAt(startAt) {
    this.examData.startAt = startAt;
    return this;
  }

  setEndAt(endAt) {
    this.examData.endAt = endAt;
    return this;
  }

  setTotalMarks(totalMarks) {
    this.examData.totalMarks = totalMarks;
    return this;
  }

  setStatus(status) {
    this.examData.status = status;
    return this;
  }



  setData(data) {
    this.examData = { ...this.examData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.examData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new Exam(this.examData);
  } 

  reset() {
    this.examData = {};
    return this;
  }

  static create() {
    return new ExamBuilder();
  }
}

module.exports = ExamBuilder;