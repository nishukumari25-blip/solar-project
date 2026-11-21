const mongoose = require('mongoose');

const netMeteringSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    capacityKW: { type: Number, required: true },
    meterNumber: { type: String, default: 'Awaiting Installation' },
    importReading: { type: String, default: '—' },
    exportReading: { type: String, default: '—' },
    syncDate: { type: String, default: null },
    status: {
      type: String,
      default: 'Meter Testing in Progress',
      enum: ['Meter Testing in Progress', 'Synchronized & Operational', 'Not Applicable'],
    },
    unlocksTranche2: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NetMetering', netMeteringSchema);
