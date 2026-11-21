const mongoose = require('mongoose');

const serviceOrderSchema = new mongoose.Schema(
  {
    soNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    discomSubdivision: { type: String, default: 'JVVNL Mansarovar Subdivision, Jaipur' },
    testingFeeStatus: { type: String, default: 'Paid (₹2,500)' },
    meterReleaseDate: { type: String, default: null },
    status: { type: String, default: 'Pending Inspection', enum: ['Pending Inspection', 'Testing Completed', 'Meter Released'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);
