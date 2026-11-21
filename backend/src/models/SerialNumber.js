const mongoose = require('mongoose');

const serialNumberSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    itemType: { type: String, required: true },
    projectId: { type: String, required: true, index: true },
    grnNumber: { type: String, required: true },
    scannedDate: { type: String, required: true },
    status: { type: String, default: 'Installed at Site' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SerialNumber', serialNumberSchema);
