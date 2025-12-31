const Joi = require("joi");

const resultSchema = Joi.object({
  id: Joi.string().optional(),

  examId: Joi.string()
    .required(), // FK → Exam.id

  studentId: Joi.string()
    .required(), // FK → Student.id

  score: Joi.number()
    .min(0)
    .required(),

  grade: Joi.string()
    .min(1)
    .max(5)
    .allow(null)
    .optional(), // e.g. "A", "B", "C"

  recordedAt: Joi.date()
    .iso()
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = resultSchema;
