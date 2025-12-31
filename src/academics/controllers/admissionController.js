  // Admission Controller
  // Handles HTTP requests for student admission (domain entry point)

  const responseStatus = require("../../handlers/responseStatus.handler");
  const AdmissionService = require("../services/admissionService");

  const admissionService = new AdmissionService();

  /* =========================
    Create (Admit Student)
    ========================= */

  const admitStudent = async (req, res) => {
    try {
      const adminId = req.userAuth?.id;

      const result = await admissionService.admitStudent(
        req.body,
        adminId
      );

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

  const getAllAdmissions = async (req, res) => {
    try {
      const result = await admissionService.getAllAdmissions();

      // Test console logger
      console.log("USER:", req.userAuth);
      console.log("PARAMS:", req.params);
      console.log("BODY:", req.body);

      responseStatus(res, 200, "success", result);
    } catch (error) {
      responseStatus(res, 400, "failed", error.message);
    }
  };

  const getAdmissionById = async (req, res) => {
    try {
      const result = await admissionService.getAdmissionById(
        req.params.id
      );

      if (!result) {
        return responseStatus(
          res,
          404,
          "failed",
          "Admission not found"
        );
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

  const getAdmissionByEmail = async (req, res) => {
    try {
      const result = await admissionService.getAdmissionByEmail(
        req.params.email
      );

      if (!result) {
        return responseStatus(
          res,
          404,
          "failed",
          "Admission not found"
        );
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

  module.exports = {
    admitStudent,
    getAllAdmissions,
    getAdmissionById,
    getAdmissionByEmail,
  };
