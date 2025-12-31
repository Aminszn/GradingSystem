// builders/UserBuilder.js
const User = require("./user");
const schema = require("./userSchema");

class UserBuilder {
  constructor() {
    this.userData = {};
  }

  setId(id) {
    this.userData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.userData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.userData.updatedAt = updatedAt;
    return this;
  }

  setUserId(userId) {
    this.userData.userId = userId;
    return this;
  }

  setPassword(password) {
    this.userData.password = password;
    return this;
  }

  setData(data) {
    this.userData = { ...this.userData, ...data };
    return this;
  }

  // validate() {
  //   const schema = Joi.object({
  //     id: Joi.string().optional(),
  //     userId: Joi.string().required(),
  //     password: Joi.string().min(6).required(),
  //     createdAt: Joi.date().iso().optional(),
  //     updatedAt: Joi.date().iso().optional(),
  //   });

  //   const { error } = schema.validate(this.userData, { abortEarly: false });
  //   if (error) {
  //     throw new Error(
  //       `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
  //     );
  //   }
  //   return true;
  // }

  build() {
    const { error } = schema.validate(this.userData);
    if (error) {
      throw new Error(
        `User validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    return new User(this.userData);
  }

  async buildWithId(excelService) {
  const seq = await excelService.getNextSequenceNumber("User");
  const id = this.generateId('USR', seq);

  return {
    ...this.userData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


  reset() {
    this.userData = {};
    return this;
  }

  static create() {
    return new UserBuilder();
  }
}

module.exports = UserBuilder;
