// src/school/models/school.js
const BaseModel = require("../../../models/baseModel");

class School extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.name = data.name || "";
    this.code = data.code || ""; // short unique code used across system (e.g. "MYHS")
    this.address = data.address || "";
    this.phone = data.phone || "";
    this.email = data.email || "";
    this.website = data.website || "";
    this.currentAcademicYear = data.currentAcademicYear || ""; // e.g. "2025/2026"
    this.currentTerm = data.currentTerm || ""; // e.g. "First Term"
  }

  toJSON() {
    const formatDate = (d) => (d instanceof Date ? d.toISOString() : d ?? null);
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      address: this.address,
      phone: this.phone,
      email: this.email,
      website: this.website,
      currentAcademicYear: this.currentAcademicYear,
      currentTerm: this.currentTerm,
      createdAt: formatDate(this.createdAt),
      updatedAt: formatDate(this.updatedAt),
    };
  }

  static fromExcelRow(row = {}) {
    const converted = { ...row };

    // Convert createdAt/updatedAt if they exist as numbers (Excel) or strings
    if (typeof converted.createdAt === "number") {
      converted.createdAt = fromExcelDate(converted.createdAt);
    } else if (typeof converted.createdAt === "string" && converted.createdAt) {
      converted.createdAt = new Date(converted.createdAt);
    } else {
      converted.createdAt = converted.createdAt || null;
    }

    if (typeof converted.updatedAt === "number") {
      converted.updatedAt = fromExcelDate(converted.updatedAt);
    } else if (typeof converted.updatedAt === "string" && converted.updatedAt) {
      converted.updatedAt = new Date(converted.updatedAt);
    } else {
      converted.updatedAt = converted.updatedAt || null;
    }

    return new School(converted);
  }
}

function fromExcelDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

module.exports = School;
