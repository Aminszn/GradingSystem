const Joi = require("joi");

const schoolSchema = Joi.object({
  id: Joi.string().optional(),

  name: Joi.string()
    .min(1)
    .max(255)
    .required(),

  code: Joi.string()
    .min(2)
    .max(20)
    .uppercase()
    .required(), // e.g. "MYHS"

  address: Joi.string()
    .allow("")
    .optional(),

  phone: Joi.string()
    .allow("")
    .optional(),

  email: Joi.string()
    .email()
    .allow("")
    .optional(),

  website: Joi.string()
    .uri()
    .allow("")
    .optional(),

  currentAcademicYear: Joi.string()
    .min(4)
    .required(), // e.g. "2025/2026"

  currentTerm: Joi.string()
    .min(1)
    .required(), // e.g. "First Term"

  createdAt: Joi.date().iso().allow(null).optional(),
  updatedAt: Joi.date().iso().allow(null).optional(),
});

module.exports = schoolSchema;
