  // models/Student.js
const BaseModel = require("../../models/baseModel");


  /**

  - Student Model - Extends BaseModel
  - Constructor calls super() first, then initializes student-specific properties
    */
    class Student extends BaseModel {
    constructor(data = {}) {
    super(data); // Initialize base properties (id, createdAt, updatedAt)
    
    // Student-specific properties
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.studentNumber = data.studentNumber || '';
    this.dateOfBirth = data.dateOfBirth || '';
    this.address = data.address || '';
    this.phoneNumber = data.phoneNumber || '';
    this.parentName = data.parentName || '';
    this.parentPhone = data.parentPhone || '';
    this.enrollmentDate = data.enrollmentDate || '';
    this.role = data.role || 'student';
    this.status = data.status || 'active';
    }

  getFullName() {
  return `${this.firstName} ${this.lastName}`.trim();
  }

  toJSON() {
    const formatDate = (d) => d instanceof Date ? d.toISOString() : d ?? null;
  return {
  id: this.id,
  firstName: this.firstName,
  lastName: this.lastName,
  email: this.email,
  studentNumber: this.studentNumber,
  dateOfBirth: formatDate(this.dateOfBirth),
  address: this.address,
  phoneNumber: this.phoneNumber,
  parentName: this.parentName,
  parentPhone: this.parentPhone,
  enrollmentDate: formatDate(this.enrollmentDate),
  status: this.status,
  role: this.role,
  createdAt: this.createdAt,
  updatedAt: this.updatedAt
  };
  }


  static fromExcelRow(row) {
    const convertedRow = {...row};

    if (typeof convertedRow.enrollmentDate === 'number') {
      convertedRow.enrollmentDate = fromExcelDate(convertedRow.enrollmentDate);
    }
    if (typeof convertedRow.dateOfBirth === 'number') {
      convertedRow.dateOfBirth = fromExcelDate(convertedRow.dateOfBirth);
    }
  return new Student(convertedRow);
  }
  }

    function fromExcelDate(serial){
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + serial * 86400000);
  }

  module.exports = Student;

