// src/system/models/adminAction.js
const BaseModel = require("../../models/baseModel");

class AdminAction extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.actorId = data.actorId || "";        // which staff did the action
    this.action = data.action || "";          // e.g. 'create','update','delete'
    this.entityType = data.entityType || "";  // e.g. 'staff','student'
    this.entityId = data.entityId || "";      // id of entity acted on
    this.timestamp = data.timestamp || new Date().toISOString();
    this.metadata = data.metadata || null;    // optional extra data
  }

  toJSON() {
    const formatDate = (d) =>
      d instanceof Date ? d.toISOString() : d ?? null;

    return {
      id: this.id,
      actorId: this.actorId,
      action: this.action,
      entityType: this.entityType,
      entityId: this.entityId,
      timestamp: formatDate(this.timestamp),
      metadata: this.metadata,
      createdAt: formatDate(this.createdAt),
      updatedAt: formatDate(this.updatedAt),
    };
  }

  static fromExcelRow(row) {
    const convertedRow = { ...row };

    if (typeof convertedRow.timestamp === "number") {
      convertedRow.timestamp = fromExcelDate(convertedRow.timestamp);
    }
    if (typeof convertedRow.createdAt === "number") {
      convertedRow.createdAt = fromExcelDate(convertedRow.createdAt);
    }
    if (typeof convertedRow.updatedAt === "number") {
      convertedRow.updatedAt = fromExcelDate(convertedRow.updatedAt);
    }

    return new AdminAction(convertedRow);
  }
}

function fromExcelDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

module.exports = AdminAction;
