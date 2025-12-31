// sequenceService.js
// Service to manage sequences for unique identifiers

const ExcelService = require("./service");

class SequenceService {
  constructor() {
    this.excelService = new ExcelService();
    this.tableName = "sequences";
  }

  async next(key) {
    const existing = await this.excelService.findByField(
      this.tableName,
      "key",
      key
    );

    if (!existing) {
      await this.excelService.create(this.tableName, {
        key,
        value: 1,
      });
      return 1;
    }

    const nextValue = Number(existing.value) + 1;

    await this.excelService.update(this.tableName, existing.id, {
      value: nextValue,
    });

    return nextValue;
  }
}
module.exports = SequenceService;