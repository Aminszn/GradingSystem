const Joi = require("joi");

const studentAttemptSchema = Joi.object({
  id: Joi.string().optional(),

  examId: Joi.string()
    .required(), // FK → Exam.id

  studentId: Joi.string()
    .required(), // FK → Student.id

  startedAt: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  submittedAt: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  status: Joi.string()
    .valid("IN_PROGRESS", "SUBMITTED", "GRADED")
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = studentAttemptSchema;
