// src/academics/models/studentAnswerBuilder.js
const StudentAnswer = require("./studentAnswer");
const schema = require("./studentAnswerSchema");

class StudentAnswerBuilder {
  constructor() {
    this.studentAnswerData = {};
  }

  setId(id) {
    this.studentAnswerData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.studentAnswerData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.studentAnswerData.updatedAt = updatedAt;
    return this;
  }

  setExamId(examId) {
    this.studentAnswerData.examId = examId;
    return this;
  } 
  
  setStudentId(studentId) {
    this.studentAnswerData.studentId = studentId;
    return this;
  }

  setQuestionId(questionId) {
    this.studentAnswerData.questionId = questionId;
    return this;
  }

  setSelectedOptionIndex(selectedOptionIndex) {
    this.studentAnswerData.selectedOptionIndex = selectedOptionIndex;
    return this;
  }

  setIsCorrect(isCorrect) {
    this.studentAnswerData.isCorrect = isCorrect;
    return this;
  }

  setMarksAwarded(marksAwarded) {
    this.studentAnswerData.marksAwarded = marksAwarded;
    return this;
  }  

  setData(data) {
    this.studentAnswerData = { ...this.studentAnswerData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.studentAnswerData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new StudentAnswer(this.studentAnswerData);
  } 

  reset() {
    this.studentAnswerData = {};
    return this;
  }
  
  static create() {
    return new StudentAnswerBuilder();
  }

}

module.exports = StudentAnswerBuilder;