// src/admissions/models/admissionBuilder.js
const Admission = require("./admission");
const schema = require("./admissionSchema");

class AdmissionBuilder {
  constructor() {
    this.admissionData = {};
  }

  // BaseModel setters
  setId(id) {
    this.admissionData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.admissionData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.admissionData.updatedAt = updatedAt;
    return this;
  }

  // Student bio
  setFirstName(firstName) {
    this.admissionData.firstName = firstName;
    return this;
  }

  setLastName(lastName) {
    this.admissionData.lastName = lastName;
    return this;
  }

  setEmail(email) {
    this.admissionData.email = email;
    return this;
  }

  setPhoneNumber(phoneNumber) {
    this.admissionData.phoneNumber = phoneNumber;
    return this;
  }

  setDateOfBirth(date) {
    this.admissionData.dateOfBirth = date;
    return this;
  }

  setGender(gender) {
    this.admissionData.gender = gender;
    return this;
  }

  // Guardian info
  setParentName(parentName) {
    this.admissionData.parentName = parentName;
    return this;
  }

  setParentPhone(parentPhone) {
    this.admissionData.parentPhone = parentPhone;
    return this;
  }

  setAddress(address) {
    this.admissionData.address = address;
    return this;
  }

  // Admission details
  setAcademicYear(academicYear) {
    this.admissionData.academicYear = academicYear;
    return this;
  }

  setEntryClassLevel(entryClassLevel) {
    this.admissionData.entryClassLevel = entryClassLevel;
    return this;
  }

  setSchoolCode(schoolCode){
    this.admissionData.schoolCode = schoolCode;
    return this;
  }

  setAdmissionDate(admissionDate) {
    this.admissionData.admissionDate = admissionDate;
    return this;
  }

  setStudentNumber(studentNumber) {
    this.admissionData.studentNumber = studentNumber;
    return this;
  }

  setStatus(status) {
    this.admissionData.status = status;
    return this;
  }

  setData(data) {
    this.admissionData = { ...this.admissionData, ...data };
    return this;
  }

  build() {
    const { error } = schema.validate(this.admissionData);
    if (error) {
      throw new Error(
        `Admission validation failed: ${error.details
          .map(d => d.message)
          .join(", ")}`
      );
    }
    return new Admission(this.admissionData);
  }

  reset() {
    this.admissionData = {};
    return this;
  }

  static create() {
    return new AdmissionBuilder();
  }
}

module.exports = AdmissionBuilder;
