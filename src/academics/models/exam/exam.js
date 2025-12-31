const BaseModel = require("../../../models/baseModel");

class Exam extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.employeeId = data.employeeId || "";
    this.classId = data.classId || "";
    this.subjectId = data.subjectId || "";

    this.title = data.title || "";
    this.instructions = data.instructions || "";
    this.duration = typeof data.duration === "number" ? data.duration : (data.duration ? Number(data.duration) : 0);

    this.academicYear = data.academicYear || null; 
    this.term = data.term || null;
    this.startAt = data.startAt instanceof Date ? data.startAt : (typeof data.startAt === "string" && data.startAt ? new Date(data.startAt) : null);
    this.endAt = data.endAt instanceof Date ? data.endAt : (typeof data.endAt === "string" && data.endAt ? new Date(data.endAt) : null);
    this.totalMarks = data.totalMarks || 0;
    this.status = data.status || ""; // e.g. DRAFT, PUBLISHED, COMPLETED
  }

  toJSON() {
    const formatDate = (d) => (d instanceof Date ? d.toISOString() : d ?? null);
    return {
      id: this.id,
      employeeId: this.employeeId,
      classId: this.classId,
      subjectId: this.subjectId,
      title: this.title,
      instructions: this.instructions,
      duration: this.duration,
      academicYear: this.academicYear,
      term: this.term,
      startAt: formatDate(this.startAt),
      endAt: formatDate(this.endAt),
      totalMarks: this.totalMarks,
      status: this.status,
      createdAt: formatDate(this.createdAt),
      updatedAt: formatDate(this.updatedAt),
    };
  }

  static fromExcelRow(row) {
    const converted = { ...row };
    if (typeof converted.startAt === "number") converted.startAt = fromExcelDate(converted.startAt);
    if (typeof converted.endAt === "number") converted.endAt = fromExcelDate(converted.endAt);
    return new Exam(converted);
  }
}

function fromExcelDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

module.exports = Exam;
