const ExcelService = require("../../db/excelHelpers/service");
const School = require("../models/school/school");
const SchoolBuilder = require("../models/school/schoolBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();

/**
 * SchoolService – Business logic layer
 */
class SchoolService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "schools";
    this.modelPrefix = "SCH";
  }

  async getAllSchools() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => School.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve schools: ${error.message}`);
    }
  }

  async getSchoolById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? School.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve school: ${error.message}`);
    }
  }

  async createSchool(data, adminId = "SYSTEM") {
    try {
      const { id, createdAt, updatedAt, ...cleanData } = data;

      const school = SchoolBuilder.create()
        .setData(cleanData)
        .build();

      const saved = await this.excelService.create(
        this.tableName,
        school,
        this.modelPrefix
      );

      if (!saved) {
        throw new Error("Persistence failed");
      };

      if (saved) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "create",
          entityType: "school",
          entityId: saved.id,
        });
      }

      return saved ? School.fromExcelRow(saved) : null;
    } catch (error) {
      throw new Error(`Failed to create school: ${error.message}`);
    }
  }

  async updateSchool(id, updateData, adminId = "SYSTEM") {
    try {
      const existing = await this.getSchoolById(id);
      if (!existing) return null;

      const { id: _, createdAt, updatedAt, ...cleanUpdateData } = updateData;

      const updated = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!updated) {
        throw new Error("Persistence failed");
      };

      if (updated) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "update",
          entityType: "school",
          entityId: updated.id,
        });
      }

      return updated ? School.fromExcelRow(updated) : null;
    } catch (error) {
      throw new Error(`Failed to update school: ${error.message}`);
    }
  }

  async deleteSchool(id, adminId = "SYSTEM") {
    try {
      const existing = await this.getSchoolById(id);
      if (!existing) return false;

      if (existing) {
        await adminActionService.log({
          actorId: adminId || "SYSTEM",
          action: "delete",
          entityType: "school",
          entityId: existing.id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete school: ${error.message}`);
    }
  }
}

module.exports = SchoolService;
