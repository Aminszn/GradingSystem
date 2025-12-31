const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string().optional(),

  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .optional(),

  dateOfBirth: Joi.date().iso().optional(),

  employeeId: Joi.string().min(3).max(50).required(),

  staffType: Joi.string()
    .valid("TEACHING", "NON_TEACHING")
    .required(),

  hireDate: Joi.date().iso().required(),
  position: Joi.string().min(2).max(100).required(),
  role: Joi.string()
    .valid(
      "admin",
      "staff"
    )
    .required(),

  email: Joi.string().email().optional(),

  phoneNumber: Joi.string().min(7).max(20).optional(),

  address: Joi.string().min(3).max(255).optional(),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE")
    .default("ACTIVE"),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = schema;
