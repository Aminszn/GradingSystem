// Enrollment Controller
// Handles HTTP requests related to student enrollments

const responseStatus = require("../../handlers/responseStatus.handler");
const EnrollmentService = require("../services/enrollmentService");

const enrollmentService = new EnrollmentService();

/* =========================
   Create
   ========================= */

const createEnrollment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await enrollmentService.createEnrollment(
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

/**
 * Business use-case:
 * Enroll student (existing or new) into a class for an academic year
 */
const enrollStudent = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;

    if (!adminId) {
      return responseStatus(
        res,
        403,
        "failed",
        "Unauthorized enrollment action"
      );
    }

    const result = await enrollmentService.enrollStudent(
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

const getAllEnrollments = async (req, res) => {
  try {
    const result = await enrollmentService.getAllEnrollments();

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const result = await enrollmentService.getEnrollmentById(
      req.params.id
    );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Enrollment not found"
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

/* =========================
   Update
   ========================= */

const updateEnrollment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const result = await enrollmentService.updateEnrollment(
      req.params.id,
      req.body,
      adminId
    );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Enrollment not found"
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

/* =========================
   Delete
   ========================= */

const deleteEnrollment = async (req, res) => {
  try {
    const adminId = req.userAuth?.id;
    const deleted = await enrollmentService.deleteEnrollment(
      req.params.id,
      adminId
    );

    if (!deleted) {
      return responseStatus(
        res,
        404,
        "failed",
        "Enrollment not found"
      );
    }

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(
      res,
      200,
      "success",
      "Enrollment deleted successfully"
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/* =========================
   Filters
   ========================= */

const getEnrollmentsByStudentId = async (req, res) => {
  try {
    const result = await enrollmentService.findByStudentId(
      req.params.studentId
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getEnrollmentsByClassId = async (req, res) => {
  try {
    const result = await enrollmentService.findByClassId(
      req.params.classId
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

const getEnrollmentByStudentAndYear = async (req, res) => {
  try {
    const { studentId, academicYear } = req.params;

    const result =
      await enrollmentService.findByStudentAndYear(
        studentId,
        academicYear
      );

    if (!result) {
      return responseStatus(
        res,
        404,
        "failed",
        "Enrollment not found for student and academic year"
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
  createEnrollment,
  enrollStudent,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudentId,
  getEnrollmentsByClassId,
  getEnrollmentByStudentAndYear,
};
