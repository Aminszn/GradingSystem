const ExcelService = require("../../db/excelHelpers/service");
const TeacherAssignment = require("../models/teacherAssignment/teacherAssignment");
const TeacherAssignmentBuilder = require("../models/teacherAssignment/teacherAssignmentBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();

/**
 * TeacherAssignmentService – Business logic layer
 */
class TeacherAssignmentService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "teacher_assignments";
    this.modelPrefix = "TAS";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllAssignments() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => TeacherAssignment.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve teacher assignments: ${error.message}`);
    }
  }

  async getAssignmentById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? TeacherAssignment.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve teacher assignment: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createAssignment(assignmentData, adminId = "SYSTEM") {
    try {
      assignmentData.assignedAt = new Date().toISOString();
      const { id, createdAt, updatedAt, ...cleanData } = assignmentData;

      const assignment = TeacherAssignmentBuilder.create()
        .setData(cleanData)
        .build();

      const result = await this.excelService.create(
        this.tableName,
        assignment,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Persistence failed");
      };


      if (result) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "create",
          entityType: "teacher_assignment",
          entityId: result.id,
        });
      }

      return result ? TeacherAssignment.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create teacher assignment: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateAssignment(id, updateData, adminId = "SYSTEM") {
    try {
      const existingAssignment = await this.getAssignmentById(id);
      if (!existingAssignment) return null;

      const { id: _, createdAt, updatedAt, ...cleanUpdateData } = updateData;

      const result = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!result) {
        throw new Error("Persistence failed");
      };

      if (result) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "update",
          entityType: "teacher_assignment",
          entityId: result.id,
        });
      }

      return result ? TeacherAssignment.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update teacher assignment: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteAssignment(id, adminId = "SYSTEM") {
    try {
      const existingAssignment = await this.getAssignmentById(id);
      if (!existingAssignment) return false;

      if (existingAssignment) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "delete",
          entityType: "teacher_assignment",
          entityId: existingAssignment.id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete teacher assignment: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findByEmployeeId(employeeId) {
    const assignments = await this.getAllAssignments();
    return assignments.filter((a) => a.employeeId === employeeId);
  }

  async findByClassId(classId) {
    const assignments = await this.getAllAssignments();
    return assignments.filter((a) => a.classId === classId);
  }

  async findBySubjectId(subjectId) {
    const assignments = await this.getAllAssignments();
    return assignments.filter((a) => a.subjectId === subjectId);
  }
}

module.exports = TeacherAssignmentService;
