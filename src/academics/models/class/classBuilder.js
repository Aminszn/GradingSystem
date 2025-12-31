// src/academics/models/classBuilder.js
const ClassEntity = require("./class");
const schema = require("./classSchema");

class ClassBuilder {
  constructor() {
    this.classData = {};
  }

  setId(id) {
    this.classData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.classData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.classData.updatedAt = updatedAt;
    return this;
  }

  setName(name) {
    this.classData.name = name;
    return this;
  }

  setLevel(level) {
    this.classData.level = level;
    return this;
  }

  setData(data) {
    this.classData = { ...this.classData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.classData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new ClassEntity(this.classData);
  }

  reset() {
    this.classData = {};
    return this;
  }

  static create() {
    return new ClassBuilder();
  } 
}

module.exports = ClassBuilder;