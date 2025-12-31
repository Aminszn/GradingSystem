// School Controller
// Handles incoming requests and responses for school-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const SchoolService = require("../services/schoolService");

const schoolService = new SchoolService();

/* =========================
   Create
   ========================= */

const createSchool = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await schoolService.createSchool(req.body, adminId);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/* =========================
   Read
   ========================= */

const getAllSchools = async (req, res) => {
  try {
    const result = await schoolService.getAllSchools();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getSchoolById = async (req, res) => {
  try {
    const result = await schoolService.getSchoolById(req.params.id);

    if (!result) {
      return responseStatus(res, 404, "failed", "School not found");
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

/* =========================
   Update
   ========================= */

const updateSchool = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await schoolService.updateSchool(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(res, 404, "failed", "School not found");
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

/* =========================
   Delete
   ========================= */

const deleteSchool = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await schoolService.deleteSchool(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(res, 404, "failed", "School not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    
    responseStatus(res, 200, "success", "School deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
};
