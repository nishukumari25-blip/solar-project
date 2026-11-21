const mongoose = require('mongoose');

const wcrSchema = new mongoose.Schema(
  {
    wcrNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    capacityKW: { type: Number, required: true },
    submissionDate: { type: String, default: null },
    discomInspector: { type: String, default: 'Er. R.K. Singhal (JVVNL)' },
    status: { type: String, default: 'Ready for Submission', enum: ['Draft', 'Ready for Submission', 'Submitted', 'Approved by DISCOM'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WCR', wcrSchema);
