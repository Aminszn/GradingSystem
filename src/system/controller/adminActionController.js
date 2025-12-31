// src/system/controllers/adminActionController.js
const adminActionService = require("../services/adminActionService");

exports.logActionController = async (req, res) => {
  await adminActionService.logAction(req.body, res);
};

exports.getAdminActionByIdController = async (req, res) => {
  await adminActionService.getAdminActionById(req.params.id, res);
};

exports.getAllAdminActionsController = async (req, res) => {
  await adminActionService.getAllAdminActions(req, res);
};
