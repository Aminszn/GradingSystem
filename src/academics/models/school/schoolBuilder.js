// src/academics/models/schoolBuilder.js
const School = require("./school");
const schema = require("./schoolSchema");

class SchoolBuilder {
  constructor() {
    this.schoolData = {};
  }

  setId(id) {
    this.schoolData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.schoolData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.schoolData.updatedAt = updatedAt;
    return this;
  }

  setName(name) {
    this.schoolData.name = name;
    return this;
  }

  setCode(code) {
    this.schoolData.code = code;
    return this;
  }

  setAddress(address) {
    this.schoolData.address = address;
    return this;
  }

  setPhone(phone) {
    this.schoolData.phone = phone;
    return this;  
  }

  setEmail(email) { 
    this.schoolData.email = email;
    return this;
  }
  
  setWebsite(website) {
    this.schoolData.website = website;
    return this;
  }

  setCurrentAcademicYear(currentAcademicYear) {
    this.schoolData.currentAcademicYear = currentAcademicYear;
    return this;
  }

  setCurrentTerm(currentTerm) {
    this.schoolData.currentTerm = currentTerm;
    return this;
  }

  setData(data) {
    this.schoolData = { ...this.schoolData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.schoolData);
    if (error) {
      throw new Error(
        `Validation failed: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return new School(this.schoolData);
  }

  reset() {
    this.schoolData = {};
    return this;
  }

  static create() {
    return new SchoolBuilder();
  } 
}

module.exports = SchoolBuilder;