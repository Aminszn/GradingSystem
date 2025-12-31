const Joi = require("joi");

const userSchema = Joi.object({
  id: Joi.string().optional(),
  userId: Joi.string().required(),
  password: Joi.string().min(6).required(),
  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = userSchema;
