// src/system/builders/adminActionBuilder.js
const schema = require("./adminActionSchema");
const AdminAction = require("./adminAction");

class AdminActionBuilder {
  constructor() {
    this.data = {};
  }

  setData(data) {
    this.data = { ...this.data, ...data };
    return this;
  }

  // validate() {
  //   const schema = Joi.object({
  //     id: Joi.string().optional(),
  //     actorId: Joi.string().required(),
  //     action: Joi.string().min(3).max(50).required(),
  //     entityType: Joi.string().min(2).max(50).required(),
  //     entityId: Joi.string().min(1).required(),
  //     timestamp: Joi.date().iso().default(new Date().toISOString()),
  //     metadata: Joi.any().optional(),
  //     createdAt: Joi.date().iso().optional(),
  //     updatedAt: Joi.date().iso().optional(),
  //   });

  //   const { error, value } = schema.validate(this.data, { abortEarly: false });
  //   if (error) {
  //     throw new Error(
  //       `AdminAction validation failed: ${error.details
  //         .map((e) => e.message)
  //         .join(", ")}`
  //     );
  //   }
  //   this.data = value;
  //   return this;
  // }

  build() {
    const { error } = schema.validate(this.data);
    if (error) {
      throw new Error(
        `AdminAction validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    return new AdminAction(this.data);
  }

  reset() {
    this.data = {};
    return this;
  }

  static create() {
    return new AdminActionBuilder();
  }
}

module.exports = AdminActionBuilder;
