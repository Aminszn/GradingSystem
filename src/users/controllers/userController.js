const responseStatus = require("../../handlers/responseStatus.handler");
const UserService = require('../services/userService');
const tokenGenerator = require('../../utils/tokenGenerator');
const StaffService = require('../../staffs/services/staffService');
const StudentService = require('../../students/services/studentService');


const service = new UserService();
const staffService = new StaffService();
const studentService = new StudentService();

exports.registerUserController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const newUser = await service.registerUser(userId, password);

      // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 201, "success", newUser);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
}

/**
 * POST /auth/login
 */
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await service.login(userId, password);

    // Resolve identity
    const staff = await staffService.getStaffByEmail(user.userId);
    const student = await studentService.getStudentByStudentNumber(user.userId);

    let authContext;

    if (staff) {
      authContext = {
        id: staff.id,
        userId: user.userId,
        role: staff.role,
        position: staff.position,
      };
    } else if (student) {
      authContext = {
        id: student.id,
        userId: user.userId,
        role: student.role,
      };
    } else {
      throw new Error("User has no linked identity");
    }

        // 3. Generate token
    const token = tokenGenerator(authContext);

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", {user: authContext, token});
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * PUT /auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userAuth.userId; // from auth middleware

    const user = await service.changePassword(
      userId,
      oldPassword,
      newPassword
    );

          // Test console logger
    console.log("USER:", req.userAuth);
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    responseStatus(res, 200, "success", { user, message: 'Password updated successfully'});
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};
