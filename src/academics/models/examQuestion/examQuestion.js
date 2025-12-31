const BaseModel = require("../../../models/baseModel");

class ExamQuestion extends BaseModel {
  constructor(data) {
    super(data);
    this.examId = data.examId || "";
    this.questionText = data.questionText || "";
    this.options = data.options || []; // Array of strings
    this.correctOption = data.correctOption ?? null;
    this.marks = data.marks ?? 1;
  }

  toJSON() {
    return {
      id: this.id,
      examId: this.examId,
      questionText: this.questionText,
      options: this.options,
      correctOption: this.correctOption,
      marks: this.marks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    const converted = { ...row };

    // parse options JSON
    if (typeof converted.options === "string") {
      try {
        converted.options = JSON.parse(converted.options);
      } catch {
        converted.options = [];
      }
    }

    return new ExamQuestion(converted);
  }
}

module.exports = ExamQuestion;
