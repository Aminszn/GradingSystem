// src/utils/generateNum.js

const pad = (num, size) => num.toString().padStart(size, "0");

/**
 * Generate Student Number
 * IMMUTABLE – Generated at admission only
 *
 * Format: YY + SCHOOL + SEQ
 * Example: 24SCH000123
 */
const generateStudentNumber = ({
  academicYear,
  schoolCode,
  admissionSeq,
}) => {
  if (!academicYear || !schoolCode || !admissionSeq) {
    throw new Error("Invalid data for student number generation");
  }

  // Extract first year of academic session
  // e.g. "2024/2025" → "24"
  const year = academicYear.slice(2, 4);

  const school = schoolCode.toUpperCase();
  const sequence = pad(admissionSeq, 6);

  return `${year}${school}${sequence}`;
};

/**
 * Generate Employee Number
 * IMMUTABLE – Generated at employment
 *
 * Format: SCHOOL-YEAR-SEQ
 * Example: SCH-2025-0001
 */
const generateEmployeeNumber = ({
  schoolCode,
  employmentDate,
  employeeSeq,
}) => {
  if (!schoolCode || !employmentDate || !employeeSeq) {
    throw new Error("Invalid data for employee number generation");
  }

  const year = new Date(employmentDate).getFullYear();
  const sequence = pad(employeeSeq, 4);

  return `${schoolCode.toUpperCase()}-${year}-${sequence}`;
};

module.exports = {
  generateStudentNumber,
  generateEmployeeNumber,
};
