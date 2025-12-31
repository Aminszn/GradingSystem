// Staff Controller
// Handles incoming requests and responses for staff-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const staffService = require("../services/staffService");

const service = new staffService();

const createStaff = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    const result = await service.createStaff(req.body, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getStaffById = async (req, res) => {
  try {
    const result = await service.getStaffById(req.params.id);
    if (!result) {
      return responseStatus(res, 404, "failed", "Staff not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const updateStaff = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    const result = await service.updateStaff(req.params.id, req.body, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staffId = req.userAuth.id; // Get the staff ID from the authenticated user
    await service.deleteStaff(req.params.id, staffId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", "Staff deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getAllStaff = async (req, res) => {
  try {
    const result = await service.getAllStaff();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getAllStaff,
};
