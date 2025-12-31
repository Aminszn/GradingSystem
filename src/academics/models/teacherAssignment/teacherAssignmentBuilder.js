// src/academics/models/teacherSubjectBuilder.js
const TeacherAssignment = require("./teacherAssignment");
const schema = require("./teacherAssignmentSchema");

class TeacherAssignmentBuilder {
  constructor() {
    this.teacherAssignmentData = {};
  }

  setId(id) {
    this.teacherAssignmentData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.teacherAssignmentData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.teacherAssignmentData.updatedAt = updatedAt;
    return this;
  }

  setEmployeeId(employeeId) {
    this.teacherAssignmentData.employeeId = employeeId;
    return this;
  }

  setSubjectId(subjectId) {
    this.teacherAssignmentData.subjectId = subjectId;
    return this;
  }

  setClassId(classId) {
    this.teacherAssignmentData.classId = classId;
    return this;
  }

  setAcademicYear(academicYear) {
    this.teacherAssignmentData.academicYear = academicYear;
    return this;
  }

  setAssignedAt(assignedAt) {
    this.teacherAssignmentData.assignedAt = assignedAt;
    return this;
  }

  setData(data) {
    this.teacherAssignmentData = { ...this.teacherAssignmentData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.teacherAssignmentData);
    if (error)  {
      throw new Error(`Invalid TeacherAssignment data: ${error.details.map(x => x.message).join(', ')}`);
    }
    return new TeacherAssignment(this.teacherAssignmentData);
  }

  reset() {
    this.teacherAssignmentData = {};
    return this;
  }

  static create() {
    return new TeacherAssignmentBuilder();
  }
}

module.exports = TeacherAssignmentBuilder;