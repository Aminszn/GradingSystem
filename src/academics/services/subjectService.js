const ExcelService = require("../../db/excelHelpers/service");
const Subject = require("../models/subject/subject");
const SubjectBuilder = require("../models/subject/subjectBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();

/**
 * SubjectService – Business logic layer
 */
class SubjectService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "subjects";
    this.modelPrefix = "SUB";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllSubjects() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => Subject.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve subjects: ${error.message}`);
    }
  }

  async getSubjectById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? Subject.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve subject: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createSubject(subjectData, adminId = "SYSTEM") {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = subjectData;

      const subject = SubjectBuilder.create()
        .setData(cleanData)
        .build();

      const result = await this.excelService.create(
        this.tableName,
        subject,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Persistence failed");
      };

      if (result) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "create",
          entityType: "subject",
          entityId: result.id,
        });
      }

      return result ? Subject.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create subject: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateSubject(id, updateData, adminId = "SYSTEM") {
    try {
      const existingSubject = await this.getSubjectById(id);
      if (!existingSubject) return null;

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
          entityType: "subject",
          entityId: result.id,
        });
      }

      return result ? Subject.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update subject: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteSubject(id, adminId = "SYSTEM") {
    try {
      const existingSubject = await this.getSubjectById(id);
      if (!existingSubject) return false;

      if (existingSubject) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "delete",
          entityType: "subject",
          entityId: existingSubject.id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete subject: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findSubjectsByLevel(level) {
    try {
      const subjects = await this.getAllSubjects();
      return subjects.filter((subject) => subject.level === level);
    } catch (error) {
      throw new Error(`Failed to find subjects by level: ${error.message}`);
    }
  }
}

module.exports = SubjectService;
