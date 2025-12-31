// src/academics/models/classSubjectBuilder.js

const ClassSubject = require("./classSubject");
const schema = require("./classSubjectSchema");

class ClassSubjectBuilder {
  constructor() {
    this.classSubjectData = {};
  }

  setId(id) {
    this.classSubjectData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.classSubjectData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.classSubjectData.updatedAt = updatedAt;
    return this;
  }

  setClassId(classId) {
    this.classSubjectData.classId = classId;
    return this;
  }

  setSubjectId(subjectId) {
    this.classSubjectData.subjectId = subjectId;
    return this;
  }

  setAcademicYear(academicYear) {
    this.classSubjectData.academicYear = academicYear;
    return this;
  }

  setAssignedAt(assignedAt) {
    this.classSubjectData.assignedAt = assignedAt;
    return this;
  }

  setData(data) {
    this.classSubjectData = { ...this.classSubjectData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.classSubjectData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new ClassSubject(this.classSubjectData);
  }

  reset() {
    this.classSubjectData = {};
    return this;
  }

  static create() {
    return new ClassSubjectBuilder();
  } 
}

module.exports = ClassSubjectBuilder;