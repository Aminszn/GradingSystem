// src/staff/builders/StaffBuilder.js
const schema = require("./staffSchema");
const Staff = require("./staff");

/**
 * StaffBuilder – Specialized builder for Staff objects
 * Uses the BaseModel class through Staff constructor
 */
class StaffBuilder {
  constructor() {
    this.staffData = {};
  }

  /* =========================
     BaseModel setters
     ========================= */
  setId(id) {
    this.staffData.id = id;
    return this;
  }

  setCreatedAt(createdAt) {
    this.staffData.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt) {
    this.staffData.updatedAt = updatedAt;
    return this;
  }

  /* =========================
     Generic data setter
     ========================= */
  setData(data) {
    this.staffData = { ...this.staffData, ...data };
    return this;
  }

  /* =========================
     Staff-specific setters
     ========================= */
  setFirstName(firstName) {
    this.staffData.firstName = firstName;
    return this;
  }

  setLastName(lastName) {
    this.staffData.lastName = lastName;
    return this;
  }

  setGender(gender) {
    this.staffData.gender = gender;
    return this;
  }

  setDateOfBirth(dateOfBirth) {
    this.staffData.dateOfBirth = dateOfBirth;
    return this;
  }

  setEmployeeId(employeeId) {
    this.staffData.employeeId = employeeId;
    return this;
  }

  setStaffType(staffType) {
    this.staffData.staffType = staffType; // "teaching" | "non-teaching"
    return this;
  }

  setHireDate(hireDate) {
    this.staffData.hireDate = hireDate;
    return this;
  }

  setPosition(position) {
    this.staffData.position = position;
    return this;
  }

  setRole(role) {
    this.staffData.role = role;
    return this;
  }

  setEmail(email) {
    this.staffData.email = email;
    return this;
  }

  setPhoneNumber(phoneNumber) {
    this.staffData.phoneNumber = phoneNumber;
    return this;
  }

  setAddress(address) {
    this.staffData.address = address;
    return this;
  }

  setStatus(status) {
    this.staffData.status = status;
    return this;
  }

  /* =========================
     Validation (optional legacy style)
     ========================= */
  validate() {
    const { error, value } = schema.validate(this.staffData, {
      abortEarly: false,
    });

    if (error) {
      throw new Error(
        `Staff validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    this.staffData = value;
    return this;
  }

  /* =========================
     Build Staff instance
     ========================= */
  build() {
    const { error } = schema.validate(this.staffData);
    if (error) {
      throw new Error(
        `Staff validation failed: ${error.details
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    return new Staff(this.staffData);
  }

  /* =========================
     Build with generated ID (Excel-based)
     ========================= */
  async buildWithId(excelService) {
    const seq = await excelService.getNextSequenceNumber("Staff");
    const id = this.generateId("STF", seq);

    return {
      ...this.staffData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /* =========================
     Reset builder
     ========================= */
  reset() {
    this.staffData = {};
    return this;
  }

  /* =========================
     Static factory
     ========================= */
  static create() {
    return new StaffBuilder();
  }
}

module.exports = StaffBuilder;
