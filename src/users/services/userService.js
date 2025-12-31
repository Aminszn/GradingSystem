const ExcelService = require('../../db/excelHelpers/service');
const User = require('../models/user');
const UserBuilder = require('../models/userBuilder');
const {
  hashPassword,
  isPassMatched
} = require('../../handlers/passHash.handler');
const AdminActionService = require('../../system/services/adminActionService');

const adminActionService = new AdminActionService();

class UserService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = 'users';
    this.modelPrefix = 'USR';
  }

  /* =========================
     INTERNAL HELPERS
     ========================= */

  async getUserByUserId(userId) {
    const rows = await this.excelService.readAll(this.tableName);
    const row = rows.find(r => r.userId === userId);
    return row ? User.fromExcelRow(row) : null;
  }

  generateDefaultPassword(lastName) {
    return lastName.toLowerCase().replace(/\s+/g, '');
  }

  /* =========================
     ADMIN USE-CASE
     ========================= */

  async registerUser({ userId, lastName }, actorId = "SYSTEM") {
    if (!userId || !lastName) {
      throw new Error('Invalid user registration data');
    }

    const existingUser = await this.getUserByUserId(userId);

    // ✅ IDEMPOTENT BEHAVIOR
    if (existingUser) {
      return {
        user: existingUser,
        defaultPassword: null
      };
    }

    const defaultPassword = this.generateDefaultPassword(lastName);
    const hashedPassword = await hashPassword(defaultPassword, 12);

    const userData = UserBuilder.create()
      .setUserId(userId)
      .setPassword(hashedPassword)
      .build();

    const result = await this.excelService.create(
      this.tableName,
      userData,
      this.modelPrefix
    );

    if (!result) {
      throw new Error("Persistence failed");
    }

    await adminActionService.log({
      actorId,
      action: "create",
      entityType: "user",
      entityId: result.id,
    });

    return {
      user: User.fromExcelRow(result),
      defaultPassword
    };
  }

  /* =========================
     USER USE-CASE
     ========================= */

  async login(userId, password) {
    if (!userId || !password) {
      throw new Error('Credentials required');
    }

    const user = await this.getUserByUserId(userId);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await isPassMatched(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.getUserByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await isPassMatched(oldPassword, user.password);
    if (!isValid) {
      throw new Error('Old password incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword, 12);

    const updated = await this.excelService.update(
      this.tableName,
      user.id,
      { password: hashedNewPassword }
    );

    if (!updated) {
      throw new Error("Persistence failed");
    }

    await adminActionService.log({
      actorId: userId,
      action: "update",
      entityType: "user",
      entityId: updated.id
    });

    return User.fromExcelRow(updated);
  }
}

module.exports = UserService;
