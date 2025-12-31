// src/admissions/models/admissionSchema.js
const Joi = require("joi");

const admissionSchema = Joi.object({
  id: Joi.string().optional(),

  // Student bio
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-\s]{7,15}$/)
    .optional()
    .messages({ "string.pattern.base": "Phone number must be valid" }),

  dateOfBirth: Joi.date().less("now").iso().required(),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .optional(),

  // Guardian info
  parentName: Joi.string().min(3).max(100).required(),

  parentPhone: Joi.string()
    .pattern(/^[0-9+\-\s]{7,15}$/)
    .required()
    .messages({ "string.pattern.base": "Parent phone must be valid" }),

  address: Joi.string().max(255).required(),

  // Admission details
  academicYear: Joi.string()
    .pattern(/^\d{4}\/\d{4}$/)
    .required(), // e.g. 2024/2025

  schoolCode: Joi.string()
  .min(2)
  .max(10)
  .required(),

  entryClassLevel: Joi.string().required(), // e.g. JSS1

  admissionDate: Joi.date().iso().optional(),

  // Identity
  studentNumber: Joi.string().alphanum().max(20).required(),

  status: Joi.string()
    .valid("admitted", "withdrawn")
    .default("admitted"),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = admissionSchema;
