// src/staff/services/StaffService.js

// Performs simple CRUD operations
const ExcelService = require("../../db/excelHelpers/service");
const SequenceService = require("../../db/excelHelpers/sequenceService");
const Staff = require("../models/staff");
const StaffBuilder = require("../models/staffBuilder");
const UserService = require("../../users/services/userService");
const AdminActionService = require("../../system/services/adminActionService");
const { generateEmployeeNumber } = require("../../utils/numGenerator");

const adminActionService = new AdminActionService();
const seqService = new SequenceService();

/**
 * StaffService – Business logic layer
 */
class StaffService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "staff";
    this.modelPrefix = "STF";
  }

  /* =========================
     Read operations
     ========================= */

  async getAllStaff() {
    try {
      const data = await this.excelService.readAll(this.tableName);
      return data.map((row) => Staff.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to retrieve staff: ${error.message}`);
    }
  }

  async getStaffById(id) {
    try {
      const data = await this.excelService.findById(this.tableName, id);
      return data ? Staff.fromExcelRow(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve staff: ${error.message}`);
    }
  }

  async getStaffByEmail(email) {
    try {
      const staffList = await this.getAllStaff();
      return staffList.find((staff) => staff.email === email) || null;
    } catch (error) {
      throw new Error(`Failed to retrieve staff by email: ${error.message}`);
    }
  }

  async getStaffByEmployeeId(employeeId) {
    try {
      const staffList = await this.getAllStaff();
      return staffList.find((staff) => staff.employeeId === employeeId) || null;
    } catch (error) {
      throw new Error(`Failed to retrieve staff by employee ID: ${error.message}`);
    }
  }

  async findStaffByName(searchName) {
    try {
      const data = await this.excelService.findByName(
        this.tableName,
        searchName
      );
      return data.map((row) => Staff.fromExcelRow(row));
    } catch (error) {
      throw new Error(`Failed to find staff by name: ${error.message}`);
    }
  }

  /* =========================
     Create operation
     ========================= */

  async createStaff(staffData, actorId = "SYSTEM") {
    try {
      // Generate unique employee ID
      const schCode = staffData.schoolCode;
      if (!schCode) {
        throw new Error("schoolCode required");
      }

      const empDate = staffData.employmentDate || new Date().toISOString();
      const year = new Date(empDate).getFullYear();

      const seqKey = `EMPLOYEE_${schCode}_${year}`;
      const employeeSeq = await seqService.next(seqKey);

      const employeeNumber = generateEmployeeNumber({
        schoolCode: schCode,
        employmentDate: empDate,
        employeeSeq,
      });

      staffData.employeeId = employeeNumber;
      staffData.hireDate = empDate;

      // Strip system-managed fields
      const { schoolCode, employmentDate, id, createdAt, updatedAt, ...cleanData } = staffData;

      const staff = StaffBuilder.create()
        .setData(cleanData)
        .build();

      // ExcelService handles ID and timestamps
      const result = await this.excelService.create(
        this.tableName,
        staff,
        this.modelPrefix
      );

      const userService = new UserService();

      if (!result) {
        throw new Error ("Staff persistence failed!")
      }
        // Also create a user account for the staff member
        const staffUser = await userService.registerUser({
          userId: result.email,
          name: result.lastName,
        });

        // Log admin action
        await adminActionService.log({
          actorId: actorId || "SYSTEM",
          action: "create",
          entityType: "staff",
          entityId: result.id,
        });

        if (staffUser?.id) {
            await adminActionService.log({
                      actorId: actorId || "SYSTEM",
                      action: "create",
                      entityType: "user",
                      entityId: staffUser.id,
                    });
        }
        

      return result ? Staff.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to create staff: ${error.message}`);
    }
  }

  /* =========================
     Update operation
     ========================= */

  async updateStaff(id, updateData, actorId = "SYSTEM") {
    try {
      const existingStaff = await this.getStaffById(id);
      if (!existingStaff) {
        return null;
      }

      // Remove system-managed fields
      const { id: dataId, createdAt, updatedAt, ...cleanUpdateData } =
        updateData;

      if (existingStaff.employeeId){
        delete cleanUpdateData.employeeId;
      }

      const result = await this.excelService.update(
        this.tableName,
        id,
        cleanUpdateData
      );

      if (!result) {
        throw new Error("Persistence failed");
      };


      if (result) {
        // Log admin action
        await adminActionService.log({
          actorId: actorId || "SYSTEM",
          action: "update",
          entityType: "staff",
          entityId: result.id,
        });
      }

      return result ? Staff.fromExcelRow(result) : null;
    } catch (error) {
      throw new Error(`Failed to update staff: ${error.message}`);
    }
  }

  /* =========================
     Delete operation
     ========================= */

  async deleteStaff(id, actorId = "SYSTEM") {
    try {
      const existingStaff = await this.getStaffById(id);
      if (!existingStaff) {
        return false;
      }

      if (existingStaff) {
        // Log admin action
        await adminActionService.log({
          actorId: actorId || "SYSTEM",
          action: "delete",
          entityType: "staff",
          entityId: id,
        });
      }

      return await this.excelService.delete(this.tableName, id);
    } catch (error) {
      throw new Error(`Failed to delete staff: ${error.message}`);
    }
  }

  /* =========================
     Simple filters
     ========================= */

  async findStaffByStaffType(staffType) {
    try {
      const staffList = await this.getAllStaff();
      return staffList.filter((staff) => staff.staffType === staffType);
    } catch (error) {
      throw new Error(`Failed to find staff by type: ${error.message}`);
    }
  }

  async findStaffByStatus(status) {
    try {
      const staffList = await this.getAllStaff();
      return staffList.filter((staff) => staff.status === status);
    } catch (error) {
      throw new Error(`Failed to find staff by status: ${error.message}`);
    }
  }
}

module.exports = StaffService;


