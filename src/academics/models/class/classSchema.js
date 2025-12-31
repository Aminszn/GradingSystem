const Joi = require("joi");

const classSchema = Joi.object({
  id: Joi.string().optional(),

  name: Joi.string()
    .min(1)
    .max(50)
    .required(), // e.g. "JSS1", "SS2"

  level: Joi.string()
    .valid("junior", "senior")
    .required(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = classSchema;
