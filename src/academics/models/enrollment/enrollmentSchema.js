const Joi = require("joi");

const enrollmentSchema = Joi.object({
  id: Joi.string().optional(),

  enrollmentKey: Joi.string().required(),

  studentId: Joi.string()
    .required(), // FK → Student.id

  classId: Joi.string()
    .required(), // FK → Class.id

  academicYear: Joi.string()
    .min(4)
    .required(), // e.g. "2023-2024"

  enrolledBy: Joi.string()
    .allow(null)
    .optional(), // FK → Staff/Admin.id

  enrolledAt: Joi.date()
    .iso()
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = enrollmentSchema;
