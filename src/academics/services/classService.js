// Performs simple CRUD operations
const ExcelService = require("../../db/excelHelpers/service");
const ClassEntity = require("../models/class/class");
const ClassBuilder = require("../models/class/classBuilder");
const AdminActionService = require("../../system/services/adminActionService");

const adminActionService = new AdminActionService();

/**
 * ClassService – Business logic layer
 */
class ClassService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "classes";
    this.modelPrefix = "CLS";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllClasses() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => ClassEntity.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve classes: ${error.message}`);
    }
  }

  async getClassById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? ClassEntity.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve class: ${error.message}`);
    }
  }

  async findClassByName(name) {
    try {
      const classes = await this.getAllClasses();
      return classes.filter((cls) => cls.name === name);
    } catch (error) {
      throw new Error(`Failed to find class by name: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createClass(classData, adminId = "SYSTEM") {
    try {
      // Strip system-managed fields
      const { id, createdAt, updatedAt, ...cleanData } = classData;

      const classEntity = ClassBuilder.create()
        .setData(cleanData)
        .build();

      // ExcelService handles ID and timestamps
      const result = await this.excelService.create(
        this.tableName,
        classEntity,
        this.modelPrefix
      );

      if (!result) {
        throw new Error("Persistence failed");
      };

      if (result) {
        await adminActionService.log({
        actorId: adminId || 'SYSTEM',
        action: "create",
        entityType: "class",
        entityId: result.id,
      });
    }

      return result ? ClassEntity.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create class: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateClass(id, updateData, adminId = "SYSTEM") {
    try {
      const existingClass = await this.getClassById(id);
      if (!existingClass) {
        return null;
      }

      // Remove system-managed fields
      const { id: dataId, createdAt, updatedAt, ...cleanUpdateData } =
        updateData;

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
          actorId: adminId || 'SYSTEM',
          action: "update",
          entityType: "class",
          entityId: result.id,
        });
      }

      return result ? ClassEntity.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update class: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteClass(id, adminId = "SYSTEM") {
    try {
      const existingClass = await this.getClassById(id);
      if (!existingClass) return false;

      if (existingClass) {
        await adminActionService.log({
          actorId: adminId || 'SYSTEM',
        action: "delete",
        entityType: "class",
        entityId: existingClass.id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete class: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findClassesByLevel(level) {
    try {
      const classes = await this.getAllClasses();
      return classes.filter((cls) => cls.level === level);
    } catch (error) {
      throw new Error(`Failed to find classes by level: ${error.message}`);
    }
  }
}

module.exports = ClassService;
