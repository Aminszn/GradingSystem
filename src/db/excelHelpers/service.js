const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

class ExcelService {
  constructor() {
    this.dataDir = path.join(__dirname, "../data");
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(tableName) {
    return path.join(this.dataDir, `${tableName}.xlsx`);
  }

  _readWorkbook(filePath) {
    if (!fs.existsSync(filePath)) {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([]), "Sheet1");
      XLSX.writeFile(wb, filePath);
      return wb;
    }
    return XLSX.readFile(filePath, { cellDates: true });
  }

  /* =========================
     CORE INTERNALS
     ========================= */

  _readAll(tableName) {
    const filePath = this.getFilePath(tableName);
    const workbook = this._readWorkbook(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet || !sheet["!ref"]) return [];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  _writeAll(tableName, data) {
    if (!Array.isArray(data)) {
      throw new Error("ExcelService writeAll expects array");
    }

    const filePath = this.getFilePath(tableName);
    const workbook = this._readWorkbook(filePath);
    const sheet = XLSX.utils.json_to_sheet(data, { skipHeader: false });
    const sheetName = workbook.SheetNames[0];

    workbook.Sheets[sheetName] = sheet;
    XLSX.writeFile(workbook, filePath);
  }

  /* =========================
     PUBLIC READS
     ========================= */

  readAll(tableName) {
    return this._readAll(tableName);
  }

  findById(tableName, id) {
    return this._readAll(tableName).find(r => r.id === id);
  }

  findByField(tableName, field, value) {
    return this._readAll(tableName).find(r => r[field] === value);
  }

  findByName(tableName, name) {
    const q = name.toLowerCase();
    return this._readAll(tableName).filter(r =>
      `${r.firstName || ""} ${r.lastName || ""}`.toLowerCase().includes(q)
    );
  }

  /* =========================
     SEQUENCE (YOUR ORIGINAL MODEL)
     ========================= */

  getNextSequenceNumber(tableName) {
    const data = this._readAll(tableName);
    return data.length + 1;
  }

  /* =========================
     SAFE MUTATIONS
     ========================= */

  create(tableName, record, modelPrefix) {
    const data = this._readAll(tableName);

    const BaseModel = require("../../models/baseModel");
    const id = BaseModel.generateId(modelPrefix, data.length + 1);
    const now = new Date().toISOString();

    const row = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now
    };

    data.push(row);
    this._writeAll(tableName, data);
    return row;
  }

  update(tableName, id, updates) {
    const data = this._readAll(tableName);
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this._writeAll(tableName, data);
    return data[index];
  }

  delete(tableName, id) {
    const data = this._readAll(tableName);
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return false;

    data.splice(index, 1);
    this._writeAll(tableName, data);
    return true;
  }
}

module.exports = ExcelService;
