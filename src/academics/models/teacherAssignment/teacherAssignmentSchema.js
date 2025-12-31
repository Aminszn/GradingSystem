const Joi = require("joi");

const teacherAssignmentSchema = Joi.object({
  id: Joi.string().optional(),

  employeeId: Joi.string()
    .min(1)
    .required(), // FK → Staff/Employee.id

  subjectId: Joi.string()
    .min(1)
    .required(), // SUB001

  classId: Joi.string()
    .min(1)
    .required(), // CLS001

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

module.exports = teacherAssignmentSchema;
