// src/staff/models/staff.js
const BaseModel = require("../../models/baseModel");

class Staff extends BaseModel {
  constructor(data) {
    super(data); // initializes id, createdAt, updatedAt

    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.gender = data.gender || "";
    this.dateOfBirth = data.dateOfBirth || "";

    this.employeeId = data.employeeId || "";
    this.staffType = data.staffType || ""; // "TEACHING" | "NON-TEACHING"
    this.hireDate = data.hireDate || "";
    this.position = data.position || "";
    this.role = data.role || "";
    this.email = data.email || "";
    this.phoneNumber = data.phoneNumber || "";
    this.address = data.address || "";

    this.status = data.status || "active";

  }

    getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  toJSON() {
    const formatDate = (d) =>
      d instanceof Date ? d.toISOString() : d ?? null;

    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      dateOfBirth: formatDate(this.dateOfBirth),
      employeeId: this.employeeId,
      staffType: this.staffType,
      hireDate: formatDate(this.hireDate),
      position: this.position,
      role: this.role,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      status: this.status,
      createdAt: formatDate(this.createdAt),
      updatedAt: formatDate(this.updatedAt),
    };
  }

  static fromExcelRow(row) {
    const convertedRow = { ...row };

    if (typeof convertedRow.hireDate === "number") {
      convertedRow.hireDate = fromExcelDate(
        convertedRow.hireDate
      );
    }
    if (typeof convertedRow.dateOfBirth === "number") {
      convertedRow.dateOfBirth = fromExcelDate(convertedRow.dateOfBirth);
    }

    // // Ensure relationships parse correctly
    // if (typeof convertedRow.enrollmentIds === "string") {
    //   try {
    //     convertedRow.enrollmentIds = JSON.parse(
    //       convertedRow.enrollmentIds
    //     );
    //   } catch {
    //     convertedRow.enrollmentIds = [];
    //   }
    // }

    return new Staff(convertedRow);
  }
}

function fromExcelDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}



module.exports = Staff;
