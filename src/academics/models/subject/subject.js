// src/academics/models/subject.js
const BaseModel = require("../../../models/baseModel");

/**
 * Subject Model
 * Represents a school subject (e.g. Mathematics, Physics)
 */
class Subject extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.name = data.name || null;   // e.g. Mathematics
    this.level = data.level || null; // junior | senior
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromExcelRow(row) {
    return new Subject({ ...row });
  }
}

module.exports = Subject;
