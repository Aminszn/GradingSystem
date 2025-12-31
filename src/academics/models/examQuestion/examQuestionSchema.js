// models/examQuestionSchema.js
const Joi = require("joi");

const examQuestionSchema = Joi.object({
  id: Joi.string().optional(),

  examId: Joi.string().required(),

  questionText: Joi.string()
    .min(1)
    .required(),

  options: Joi.array()
    .items(Joi.string().min(1))
    .min(2)
    .required(),

  correctOption: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string())
    .required(),

  marks: Joi.number()
    .integer()
    .min(1)
    .optional(),

  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
});

module.exports = examQuestionSchema;
