const Joi = require("joi");

const studentAnswerSchema = Joi.object({
  id: Joi.string().optional(),

  examId: Joi.string()
    .required(), // FK → Exam.id

  studentId: Joi.string()
    .required(), // FK → Student.id

  questionId: Joi.string()
    .required(), // FK → ExamQuestion.id

  selectedOptionIndex: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional(),

  isCorrect: Joi.boolean().optional().allow(null),


  marksAwarded: Joi.number()
    .min(0)
    .optional(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = studentAnswerSchema;
