// services/StudentService.js
const ExcelService = require('../../db/excelHelpers/service');
const Student = require('../models/student');
const StudentBuilder = require('../models/studentBuilder');
const AdminActionService = require('../../system/services/adminActionService');
const UserService = require('../../users/services/userService');

const adminActionService = new AdminActionService();
const userService = new UserService();

class StudentService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = 'students';
    this.modelPrefix = 'STU';
  }

  /* =========================
     READ
     ========================= */

  async getAllStudents() {
    const data = await this.excelService.readAll(this.tableName);
    return data.map(row => Student.fromExcelRow(row));
  }

  async getStudentById(id) {
    const data = await this.excelService.findById(this.tableName, id);
    return data ? Student.fromExcelRow(data) : null;
  }

  async getStudentByStudentNumber(studentNumber) {
    const students = await this.getAllStudents();
    return students.find(s => s.studentNumber === studentNumber) || null;
  }

  async getStudentByEmail(email) {
    const students = await this.getAllStudents();
    return students.find(s => s.email === email) || null;
  }

  /* =========================
     CREATE (CALLED BY ADMISSION)
     ========================= */

  async createStudent(studentData, actorId = "SYSTEM") {
    const {
      studentNumber,
      email,
      ...rest
    } = studentData;

    if (!studentNumber) {
      throw new Error("studentNumber is required (Admission responsibility)");
    }

    const existingByNumber = await this.getStudentByStudentNumber(studentNumber);

    if (existingByNumber) {
      throw new Error("Student number already exists");
    }


    // Enforce uniqueness
    const existing = await this.getStudentByEmail(email);
    if (existing) {
      throw new Error("Student already exists");
    }

    const student = StudentBuilder.create()
      .setData({
        ...rest,
        email,
        studentNumber,
        status: rest.status || "active",
      })
      .build();

    const result = await this.excelService.create(
      this.tableName,
      student,
      this.modelPrefix
    );

    if (!result) {
      throw new Error("Student persistence failed");
    }

    /* =========================
       Create User Identity
       ========================= */

      await userService.registerUser({
      userId: studentNumber,
      lastName: student.lastName,
    }, actorId);


    /* =========================
       Audit
       ========================= */

    await adminActionService.log({
      actorId,
      action: "create",
      entityType: "student",
      entityId: result.id,
    });

    return Student.fromExcelRow(result);
  }

  /* =========================
     UPDATE (NO IDENTITY MUTATION)
     ========================= */

  async updateStudent(id, updateData, actorId = "SYSTEM") {
    const existing = await this.getStudentById(id);
    if (!existing) return null;

    const {
      id: _,
      createdAt,
      updatedAt,
      studentNumber, // immutable
      ...cleanUpdateData
    } = updateData;

    const result = await this.excelService.update(
      this.tableName,
      id,
      cleanUpdateData
    );

    if (!result) {
      throw new Error("Persistence failed");
    }

    await adminActionService.log({
      actorId,
      action: "update",
      entityType: "student",
      entityId: id,
    });

    return Student.fromExcelRow(result);
  }

  /* =========================
     DELETE
     ========================= */

  async deleteStudent(id, actorId = "SYSTEM") {
    const existing = await this.getStudentById(id);
    if (!existing) return false;

    await adminActionService.log({
      actorId,
      action: "delete",
      entityType: "student",
      entityId: id,
    });

    return this.excelService.delete(this.tableName, id);
  }
}

module.exports = StudentService;
