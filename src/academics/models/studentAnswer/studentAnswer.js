// src/academics/models/studentAnswer.js
const BaseModel = require("../../../models/baseModel");

/**
 * StudentAnswer Model
 * Represents a student's answer to an exam question.
 */
class StudentAnswer extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.examId = data.examId || null;                   // ID of the exam
    this.studentId = data.studentId || null;             // ID of the student
    this.questionId = data.questionId || null;           // ID of the question
    this.selectedOptionIndex = data.selectedOptionIndex || null; // Index of the selected option
    this.isCorrect = data.isCorrect || false;            // Whether the answer is correct
    this.marksAwarded = data.marksAwarded || 0;          // Marks awarded for the answer
  }

  toJSON() {
    return {
      id: this.id,
      examId: this.examId,
      studentId: this.studentId,
      questionId: this.questionId,
      selectedOptionIndex: this.selectedOptionIndex,
      isCorrect: this.isCorrect,
      marksAwarded: this.marksAwarded,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new StudentAnswer({ ...row });
  }
}

module.exports = StudentAnswer;



// Key fields

// id

// examId

// studentId

// questionId

// selectedOptionIndex

// isCorrect

// marksAwarded