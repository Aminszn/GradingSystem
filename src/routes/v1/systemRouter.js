const express = require("express");
const StaffService = require("../../staffs/services/staffService");

const systemRouter = express.Router();
const staffService = new StaffService();

/**
 * TEMPORARY: Seed initial admin
 * REMOVE AFTER FIRST SUCCESSFUL RUN
 */
systemRouter.post("/seed-admin", async (req, res) => {
  try {
    // 1. Check if an admin already exists
    const staffList = await staffService.getAllStaff();
    const adminExists = staffList.some(
      (staff) => staff.role === "Admin"
    );

    if (adminExists) {
      return res.status(400).json({
        status: "failed",
        message: "Admin already exists. Seeding is disabled.",
      });
    }

    // 2. Create admin staff
    const adminData = {
  firstName: "System",
  lastName: "Admin",
  gender: "MALE",
  dateOfBirth: "1980-01-01",
  staffType: "NON_TEACHING",
  position: "Principal",
  role: "admin",
  email: "admin@school.com",
  phoneNumber: "08000000000",
  address: "System",
  schoolCode: "SCH"
};

    const admin = await staffService.createStaff(adminData, "SYSTEM");

    return res.status(201).json({
      status: "success",
      message: "Initial admin seeded successfully",
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = systemRouter;
