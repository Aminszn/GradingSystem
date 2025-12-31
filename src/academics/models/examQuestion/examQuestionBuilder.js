// models/ExamQuestionBuilder.js
const ExamQuestion = require("./examQuestion");
const schema = require("./examQuestionSchema");

class ExamQuestionBuilder {
  constructor() {
    this.questionData = {};
  }

  /* =================================================
     BASE MODEL FIELDS
     ================================================= */

  setId(id) {
    this.questionData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.questionData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.questionData.updatedAt = updatedAt;
    return this;
  }

  /* =================================================
     DOMAIN FIELDS
     ================================================= */

  setExamId(examId) {
    this.questionData.examId = examId;
    return this;
  }

  setQuestionText(text) {
    this.questionData.questionText = text;
    return this;
  }

  setOptions(options) {
    this.questionData.options = options;
    return this;
  }

  setCorrectOption(correctOption) {
    this.questionData.correctOption = correctOption;
    return this;
  }

  setMarks(marks) {
    this.questionData.marks = marks;
    return this;
  }

  setData(data) {
    this.questionData = { ...this.questionData, ...data };
    return this;
  }

  /* =================================================
     BUILD
     ================================================= */

  build() {
    const { error } = schema.validate(this.questionData, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `ExamQuestion validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    return new ExamQuestion(this.questionData);
  }

  async buildWithId(excelService) {
    const seq = await excelService.getNextSequenceNumber("exam_questions");
    const id = `EXQ${String(seq).padStart(3, "0")}`;

    const dataWithMeta = {
      ...this.questionData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { error } = schema.validate(dataWithMeta, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `ExamQuestion validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    return dataWithMeta;
  }

  reset() {
    this.questionData = {};
    return this;
  }

  static create() {
    return new ExamQuestionBuilder();
  }
}

module.exports = ExamQuestionBuilder;
