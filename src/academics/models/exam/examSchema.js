const Joi = require("joi");

const examSchema = Joi.object({
  id: Joi.string().optional(),

  employeeId: Joi.string().required(),
  classId: Joi.string().required(),
  subjectId: Joi.string().required(),

  title: Joi.string()
    .min(1)
    .max(255)
    .required(),

  instructions: Joi.string()
    .allow("")
    .optional(),

  duration: Joi.number()
    .integer()
    .min(1)
    .required(), // duration in minutes

  academicYear: Joi.string()
    .allow(null)
    .optional(), // e.g. "2024/2025"

  term: Joi.string()
    .allow(null)
    .optional(), // e.g. "FIRST", "SECOND", "THIRD"

  startAt: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  endAt: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  totalMarks: Joi.number()
    .integer()
    .min(0)
    .optional(),

  status: Joi.string()
    .valid("DRAFT", "PUBLISHED", "COMPLETED")
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = examSchema;
