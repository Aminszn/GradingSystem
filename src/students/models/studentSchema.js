  const Joi = require("joi");
  
  const schema = Joi.object({
    id: Joi.string().alphanum().min(5).max(20).optional(), 
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    studentNumber: Joi.string().alphanum().max(20).optional(),
    dateOfBirth: Joi.date().less("now").iso().optional(),
    gender: Joi.string()
        .valid("MALE", "FEMALE", "OTHER")
        .optional(),
    address: Joi.string().max(255).optional(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9+\-\s]{7,15}$/)
      .optional()
      .messages({ "string.pattern.base": "Phone number must be valid" }),
    parentName: Joi.string().max(100).optional(),
    parentPhone: Joi.string()
      .pattern(/^[0-9+\-\s]{7,15}$/)
      .optional()
      .messages({ "string.pattern.base": "Parent phone must be valid" }),
    enrollmentDate: Joi.date().less("now").iso().optional(),
    status: Joi.string().valid("active", "inactive").default("active"),
    role: Joi.string().valid("student").default("student"),
    createdAt: Joi.date().iso().optional(),
    updatedAt: Joi.date().iso().optional(),
  });

  module.exports = schema;