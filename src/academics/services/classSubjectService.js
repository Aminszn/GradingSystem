const ExcelService = require("../../db/excelHelpers/service");
const ClassSubject = require("../models/classSubject/classSubject");
const ClassSubjectBuilder = require("../models/classSubject/classSubjectBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();

/**
 * ClassSubjectService – Business logic layer
 */
class ClassSubjectService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "class_subjects";
    this.modelPrefix = "CSB";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllAssignments() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => ClassSubject.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve class-subject assignments: ${error.message}`);
    }
  }

  async getAssignmentById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? ClassSubject.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve assignment: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createAssignment(data, adminId = "SYSTEM") {
    try {
      data.assignedAt = new Date().toISOString();
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const assignment = ClassSubjectBuilder.create()
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
        actorId: adminId || 'SYSTEM',
        action: "create",
        entityType: "class_subject_assignment",
        entityId: result.id,
      });
      }

      return result ? ClassSubject.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create class-subject assignment: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateAssignment(id, updateData, adminId = "SYSTEM") {
    try {
      const existing = await this.getAssignmentById(id);
      if (!existing) return null;

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
          actorId: adminId|| 'SYSTEM',
          action: "update",
          entityType: "class_subject_assignment",
          entityId: result.id,
        });
      }

      return result ? ClassSubject.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update class-subject assignment: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteAssignment(id, adminId = "SYSTEM") {
    try {
      const existing = await this.getAssignmentById(id);
      if (!existing) return false;

      if (existing) {
        await adminActionService.log({
        actorId: adminId|| 'SYSTEM',
        action: "delete",
        entityType: "class_subject_assignment",
        entityId: existing.id,
        });
      }
      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete class-subject assignment: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findByClassId(classId) {
    const list = await this.getAllAssignments();
    return list.filter((a) => a.classId === classId);
  }

  async findByAcademicYear(academicYear) {
    const list = await this.getAllAssignments();
    return list.filter((a) => a.academicYear === academicYear);
  }
}

module.exports = ClassSubjectService;
