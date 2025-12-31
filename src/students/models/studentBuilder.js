// builders/StudentBuilder.js
const schema = require('./studentSchema');
const Student = require('./student');

/**

- StudentBuilder - Specialized builder for Student objects
- Uses the BaseModel class through Student constructor
  */
  class StudentBuilder {
    constructor() {
    this.studentData = {};
  }

// Base model setters
setId(id) {
  this.studentData.id = id;
  return this;
}

setCreatedAt(createdAt) {
  this.studentData.createdAt = createdAt;
  return this;
}

setUpdatedAt(updatedAt) {
  this.studentData.updatedAt = updatedAt;
  return this;
}

// Setters
setData(data) {
    this.studentData = { ...this.studentData, ...data };
    return this;
}
// Student-specific setters
setFirstName(firstName) {
  this.studentData.firstName = firstName;
  return this;
}

setLastName(lastName) {
  this.studentData.lastName = lastName;
  return this;
}

setEmail(email) {
  this.studentData.email = email;
  return this;
}

setStudentNumber(studentNumber) {
  this.studentData.studentNumber = studentNumber;
  return this;
}

setDateOfBirth(dateOfBirth) {
  this.studentData.dateOfBirth = dateOfBirth;
  return this;
}

setAddress(address) {
  this.studentData.address = address;
  return this;
}

setPhoneNumber(phoneNumber) {
  this.studentData.phoneNumber = phoneNumber;
  return this;
}

setParentName(parentName) {
  this.studentData.parentName = parentName;
  return this;
}

setParentPhone(parentPhone) {
  this.studentData.parentPhone = parentPhone;
  return this;
}

setEnrollmentDate(enrollmentDate) {
  this.studentData.enrollmentDate = enrollmentDate;
  return this;
}

setStatus(status) {
  this.studentData.status = status;
  return this;
}

  // Validation (old method, not used)
validate() {

  const { error, value } = schema.validate(this.studentData, { abortEarly: false });

  if (error) throw new Error(`Student validation failed: ${error.details.map(e => e.message).join(", ")}`);

  this.studentData = value;
  return this;
}

/**

- Build the Student instance
- This creates the Student object which automatically calls BaseModel constructor
  */
  build() {
    const { error } = schema.validate(this.studentData);
    if (error) {
    throw new Error(`Student validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }
    return new Student(this.studentData);
  }

  // StudentBuilder
  // not called 
async buildWithId(excelService) {
  const seq = await excelService.getNextSequenceNumber("Students");
  const id = this.generateId('STU', seq);

  return {
    ...this.studentData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


/**

- Reset builder for reuse
  */
  reset() {
    this.studentData = {};
    return this;
  }

/**

- Static factory method
  */
  static create() {
    return new StudentBuilder();
    }
  }

module.exports = StudentBuilder;
