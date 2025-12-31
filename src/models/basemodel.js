// models/BaseModel.js
const shortUUID = require('short-uuid');

/**

- BaseModel - Foundation class for all models
- Constructor handles common properties that every model needs
  */
  class BaseModel {
  constructor(data = {}) {
  this.id = data.id || null;
  this.createdAt = data.createdAt || new Date().toISOString();
  this.updatedAt = data.updatedAt || new Date().toISOString();
  }

/**

- Generate sequential-looking ID for any model
  */
  static generateId(modelPrefix, sequenceNumber) {
  const shortId = shortUUID.generate();
  const baseId = shortId.substring(0, 4);
  const sequentialId = `${modelPrefix}${sequenceNumber.toString().padStart(4, '0')}-${baseId}`;
  return sequentialId;
  }

update() {
this.updatedAt = new Date().toISOString();
}
}

module.exports = BaseModel;