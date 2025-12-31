const Joi = require("joi");

    const schema = Joi.object({
      id: Joi.string().optional(),
      actorId: Joi.string().required(),
      action: Joi.string().min(3).max(50).required(),
      entityType: Joi.string().min(2).max(50).required(),
      entityId: Joi.string().min(1).required(),
      timestamp: Joi.date().iso().default(new Date().toISOString()),
      metadata: Joi.any().optional(),
      createdAt: Joi.date().iso().optional(),
      updatedAt: Joi.date().iso().optional(),
    });

module.exports = schema;
