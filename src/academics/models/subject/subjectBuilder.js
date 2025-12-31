// src/academics/models/subjectBuilder.js
const Subject = require("./subject");
const schema = require("./subjectSchema");

class SubjectBuilder {
  constructor() {
    this.subjectData = {};
  }

  setId(id) {
    this.subjectData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.subjectData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.subjectData.updatedAt = updatedAt;
    return this;
  }

  setName(name) {
    this.subjectData.name = name;
    return this;
  }

  setLevel(level) {
    this.subjectData.level = level;
    return this;
  }

  setDescription(description) {
    this.subjectData.description = description;
    return this;
  }

  setData(data) {
    this.subjectData = { ...this.subjectData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.subjectData);
    if (error) {
      throw new Error(`Invalid Subject data: ${error.details.map(x => x.message).join(', ')}`);
    }
    return new Subject(this.subjectData);
  }

  reset() {
    this.subjectData = {};
    return this;
  }

  static create() {
    return new SubjectBuilder();
  }
}

module.exports = SubjectBuilder;