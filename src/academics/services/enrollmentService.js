const ExcelService = require("../../db/excelHelpers/service");
const Enrollment = require("../models/enrollment/enrollment");
const EnrollmentBuilder = require("../models/enrollment/enrollmentBuilder");
const AdminActionService = require("../../system/services/adminActionService");
const StudentService = require("../../students/services/studentService");

const adminActionService = new AdminActionService();
const studentService = new StudentService();

/**
 * EnrollmentService – Pure enrollment logic
 */
class EnrollmentService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "enrollments";
    this.modelPrefix = "ENR";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllEnrollments() {
    const data = await this.excelService.readAll(this.tableName);
    return data.map(row => Enrollment.fromExcelRow(row));
  }

  async getEnrollmentById(id) {
    const data = await this.excelService.findById(this.tableName, id);
    return data ? Enrollment.fromExcelRow(data) : null;
  }

  /* =========================
     Domain operation
     ========================= */

  async enrollStudent(payload, adminId = "SYSTEM") {
    try {
      const {
        studentId,
        classId,
        academicYear,
        enrolledAt
      } = payload;

      /* 1. Validate required inputs */
      if (!studentId || !classId || !academicYear) {
        throw new Error("studentId, classId and academicYear are required");
      }

      /* 2. Student must already exist */
      const student = await studentService.getStudentById(studentId);
      if (!student) {
        throw new Error("Student does not exist. Admission required.");
      }

      /* 3. Prevent duplicate enrollment */
      const existing = await this.findByStudentAndYear(
        studentId,
        academicYear
      );

      if (existing) {
        throw new Error(
          "Student is already enrolled for this academic year"
        );
      }

      const enrollmentKey = `${studentId}_${academicYear}`;

      /* 4. Create enrollment */
      const enrollment = EnrollmentBuilder.create()
        .setData({
          enrollmentKey,
          studentId,
          classId,
          academicYear,
          enrolledBy: adminId,
          enrolledAt: enrolledAt || new Date().toISOString(),
        })
        .build();

      const result = await this.excelService.create(
        this.tableName,
        enrollment,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Enrollment persistence failed");
      }

      /* 5. Audit */
      await adminActionService.log({
        actorId: adminId,
        action: "enroll",
        entityType: "student",
        entityId: studentId,
      });

      return Enrollment.fromExcelRow(result);

    } catch (error) {
      throw new Error(`Failed to enroll student: ${error.message}`);
    }
  }

  /* =========================
     Helpers
     ========================= */

  async findByStudentId(studentId) {
    const list = await this.getAllEnrollments();
    return list.filter(e => e.studentId === studentId);
  }

  async findByClassId(classId) {
    const list = await this.getAllEnrollments();
    return list.filter(e => e.classId === classId);
  }

  async findByStudentAndYear(studentId, academicYear) {
    const list = await this.findByStudentId(studentId);
    return list.find(e => e.academicYear === academicYear);
  }
}

module.exports = EnrollmentService;
