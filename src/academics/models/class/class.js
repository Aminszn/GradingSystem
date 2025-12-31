// src/academics/models/class.js
const BaseModel = require("../../../models/baseModel");

/**
 * Class Model
 * Represents a school class/level (e.g. JSS1, SS2).
 */
class ClassEntity extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.name = data.name || null;   // e.g. "JSS1"
    this.level = data.level || null; // e.g. "junior" | "senior"
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
    return new ClassEntity({ ...row });
  }
}

module.exports = ClassEntity;
