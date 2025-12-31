  // models/User.js
const BaseModel = require("../../models/baseModel");

  /**

  - User Model - Extends BaseModel
  - Constructor calls super() first, then initializes student-specific properties
    */
    class User extends BaseModel {
    constructor(data = {}) {
    super(data); // Initialize base properties (id, createdAt, updatedAt)

    this.userId = data.userId || '', // FK Id for user type/role
    this.password = data.password || ''
    }
    
    toJSON () {
      return {
        id: this.id,
        userId: this.userId,
        password: this.password,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }


    static fromExcelRow(row) {
      return new User({
        ...row,
        password: row.password || row.hashedPass || ""
      });
    }

  }

  module.exports = User;