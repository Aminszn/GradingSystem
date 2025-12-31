const Joi = require("joi");

const subjectSchema = Joi.object({
  id: Joi.string().optional(),

  name: Joi.string()
    .min(1)
    .max(100)
    .required(), // e.g. "Mathematics"

  level: Joi.string()
    .valid("junior", "senior")
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = subjectSchema;
