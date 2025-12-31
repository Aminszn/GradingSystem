// Performs simple CRUD operations + orchestration
const ExcelService = require("../../db/excelHelpers/service");
const Admission = require("../../academics/models/admission/admission");
const AdmissionBuilder = require("../../academics/models/admission/admissionBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const StudentService = require("../../students/services/studentService");
const EnrollmentService = require("../../academics/services/enrollmentService");
const ClassService = require("../../academics/services/classService");

const SequenceService = require("../../db/excelHelpers/sequenceService");
const { generateStudentNumber } = require("../../utils/numGenerator");

const adminActionService = new AdminActionService();

/**
 * AdmissionService – Domain entry point
 * Admission → Student → Enrollment
 */
class AdmissionService {
  constructor() {
    this.excelService = new ExcelService();
    this.sequenceService = new SequenceService();

    this.studentService = new StudentService();
    this.enrollmentService = new EnrollmentService();
    this.classService = new ClassService();

    this.tableName = "admissions";
    this.modelPrefix = "ADM";
  }

  /* =========================
     CREATE (DOMAIN ENTRY POINT)
     ========================= */

  async admitStudent(admissionData, adminId = "SYSTEM") {
    try {
      /* 1. Prevent duplicate admission */
      const existing = await this.getAdmissionByEmail(admissionData.email);
      if (existing) {
        throw new Error("Student has already been admitted");
      }

      /* 2. Resolve classId from entryClassLevel */
      const classes = await this.classService.findClassByName(
        admissionData.entryClassLevel
      );

      if (!classes || classes.length === 0) {
        throw new Error(
          `Invalid entry class level: ${admissionData.entryClassLevel}`
        );
      }

      const classEntity = classes[0];
      const classId = classEntity.id;

      /* 3. Generate studentNumber (IMMUTABLE) */
      const admissionSeq = await this.sequenceService.next("student_admission");

      const studentNumber = generateStudentNumber({
        academicYear: admissionData.academicYear,
        schoolCode: admissionData.schoolCode, // REQUIRED
        admissionSeq,
      });

      /* 4. Create Admission record */
      const { id, createdAt, updatedAt, ...cleanData } = admissionData;

      const admission = AdmissionBuilder.create()
        .setData({
          ...cleanData,
          studentNumber,
          admissionDate:
            cleanData.admissionDate || new Date().toISOString(),
        })
        .build();

      const admissionRow = await this.excelService.create(
        this.tableName,
        admission,
        this.modelPrefix
      );

      if (!admissionRow) {
        throw new Error("Admission persistence failed");
      }

      /* 5. Create Student (identity already generated) */
      const student = await this.studentService.createStudent(
        {
          firstName: admission.firstName,
          lastName: admission.lastName,
          email: admission.email,
          studentNumber: admission.studentNumber,
          dateOfBirth: admission.dateOfBirth,
          gender: admission.gender?.toUpperCase(),
          address: admission.address,
          phoneNumber: admission.phoneNumber,
          parentName: admission.parentName,
          parentPhone: admission.parentPhone,
          enrollmentDate: admission.admissionDate,
          status: "active",
        },
        adminId
      );

      if (!student) {
        throw new Error("Student creation failed");
      }

      /* 6. Enroll Student */
      const enrollment = await this.enrollmentService.enrollStudent(
        {
          studentId: student.id,
          classId,
          academicYear: admission.academicYear,
          enrolledAt: new Date().toISOString(),
          enrolledBy: adminId,
        },
        adminId
      );

      if (!enrollment) {
        throw new Error("Enrollment failed during admission");
      };

      /* 7. Audit */
      await adminActionService.log({
        actorId: adminId,
        action: "create",
        entityType: "admission",
        entityId: admissionRow.id,
      });

      return Admission.fromExcelRow(admissionRow);

    } catch (error) {
      throw new Error(`Failed to admit student: ${error.message}`);
    }
  }

  /* =========================
     READ HELPERS
     ========================= */

  async getAllAdmissions() {
    const data = await this.excelService.readAll(this.tableName);
    return data.map(row => Admission.fromExcelRow(row));
  }

  async getAdmissionByEmail(email) {
    const admissions = await this.getAllAdmissions();
    return admissions.find(a => a.email === email) || null;
  }

  async getAdmissionById(id) {
    const data = await this.excelService.findById(this.tableName, id);
    return data ? Admission.fromExcelRow(data) : null;
  }
}

module.exports = AdmissionService;
