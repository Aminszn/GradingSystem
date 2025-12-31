// src/academics/models/teacherAssignment.js
const BaseModel = require("../../../models/baseModel");

class TeacherAssignment extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.employeeId = data.employeeId || ""; // Generated unique employee ID
    this.subjectId = data.subjectId || ""; // SUB001
    this.classId = data.classId || "";     // CLS001
    this.academicYear = data.academicYear || "";
    this.assignedAt = data.assignedAt || null;
  }

  toJSON() {
    const formatDate = (d) => (d instanceof Date ? d.toISOString() : d ?? null);
    return {
      id: this.id,
      employeeId: this.employeeId,
      subjectId: this.subjectId,
      classId: this.classId,
      academicYear: this.academicYear,
      assignedAt: formatDate(this.assignedAt),
      createdAt: formatDate(this.createdAt),
      updatedAt: formatDate(this.updatedAt),
    };
  }

  static fromExcelRow(row) {
    const convertedRow = { ...row };

    if (typeof convertedRow.assignedAt === "number") {
      convertedRow.assignedAt = fromExcelDate(convertedRow.assignedAt);
    }
    if (typeof convertedRow.createdAt === "number") {
      convertedRow.createdAt = fromExcelDate(convertedRow.createdAt);
    }
    if (typeof convertedRow.updatedAt === "number") {
      convertedRow.updatedAt = fromExcelDate(convertedRow.updatedAt);
    }

    return new TeacherAssignment(convertedRow);
  }
}

function fromExcelDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

module.exports = TeacherAssignment;
