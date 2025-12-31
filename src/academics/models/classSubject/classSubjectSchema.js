const Joi = require("joi");

const classSubjectSchema = Joi.object({
  id: Joi.string().optional(),

  classId: Joi.string()
    .min(1)
    .required(), // e.g. CLS001

  subjectId: Joi.string()
    .min(1)
    .required(), // e.g. SUB001

  academicYear: Joi.string()
    .min(4)
    .required(), // e.g. "2025/2026"

  assignedAt: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = classSubjectSchema;
