const responseStatus = require("../handlers/responseStatus.handler");
const ExcelService = require('../db/excelHelpers/service');

const excelService = new ExcelService();

const isAdmin = async (req, res, next) => {
  try {
    if (!req.userAuth || !req.userAuth.id) {
      return responseStatus(res, 401, 'failed', 'Unauthorized');
    }

    const admin = await excelService.findById('staff', req.userAuth.id);

    if (!admin) {
      return responseStatus(res, 403, 'failed', 'Admin not found');
    }

    if (admin.role === 'admin') {
      return next();
    }

    return responseStatus(res, 403, 'failed', 'Admin only route');
  } catch (error) {
    return responseStatus(res, 500, 'failed', error.message);
  }
};

module.exports = isAdmin;
