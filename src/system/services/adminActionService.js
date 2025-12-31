// src/system/services/adminActionService.js
const ExcelService = require("../../db/excelHelpers/service");
const AdminAction = require("../models/adminAction");
const AdminActionBuilder = require("../models/adminActionBuilder");

class AdminActionService {
  constructor() {
    this.tableName = "admin_actions";
    this.modelPrefix = "ADM";
    this.excelService = new ExcelService();
  }

  async log(actionData) {
    try {
    const adminAction = AdminActionBuilder.create().setData(actionData).build();
    const createdRow = await this.excelService.create(
      this.tableName,
      adminAction,
      this.modelPrefix
    );
    return AdminAction.fromExcelRow(createdRow);      
    } catch (error) {
      console.error("🚨 Error logging admin action:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const row = await this.excelService.findById(this.tableName, id);
      return row ? AdminAction.fromExcelRow(row) : null;
    } catch (error) {
      console.error("🚨 Error fetching admin action by ID:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      const rows = await this.excelService.readAll(this.tableName);
      return rows.map((r) => AdminAction.fromExcelRow(r));
    } catch (error) {
      console.error("🚨 Error fetching all admin actions:", error);
      throw error;
    }
  }

  async getByActor(actorId) {
    try {
      const all = await this.getAll();
      return all.filter((a) => a.actorId === actorId);
    } catch (error) {
      console.error("🚨 Error fetching admin actions by actor:", error);
      throw error;
    }
  }
}

module.exports = AdminActionService;
