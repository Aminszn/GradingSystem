// Class Controller
// Handles incoming requests and responses for class-related operations

const responseStatus = require("../../handlers/responseStatus.handler");
const ClassService = require("../services/classService");

const classService = new ClassService();

/* =========================
   Create
   ========================= */

const createClass = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await classService.createClass(req.body, adminId);

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

const getAllClasses = async (req, res) => {
  try {
    const result = await classService.getAllClasses();

    // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getClassById = async (req, res) => {
  try {
    const result = await classService.getClassById(req.params.id);
    if (!result) {
      return responseStatus(res, 404, "failed", "Class not found");
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

const findClassByName = async (req, res) => {
  try {
    const result = await classService.findClassByName(req.params.name);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const findClassesByLevel = async (req, res) => {
  try {
    const result = await classService.findClassesByLevel(req.params.level);

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

const updateClass = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await classService.updateClass(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(res, 404, "failed", "Class not found");
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

const deleteClass = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await classService.deleteClass(req.params.id, adminId);

    if (!deleted) {
      return responseStatus(res, 404, "failed", "Class not found");
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", "Class deleted successfully");
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  findClassByName,
  findClassesByLevel,
  updateClass,
  deleteClass,
};
