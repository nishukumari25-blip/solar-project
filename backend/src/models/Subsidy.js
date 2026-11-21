const mongoose = require('mongoose');

const subsidySchema = new mongoose.Schema(
  {
    applicationNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    consumerNumber: { type: String, required: true },
    currentStage: {
      type: String,
      required: true,
      default: 'Application Registered',
      enum: [
        'Application Registered',
        'Feasibility Approved',
        'Installation Uploaded',
        'DISCOM Inspection',
        'Net Metering Done',
        'Subsidy Claim Submitted',
        'Subsidy Credited to Customer',
        'Not Applicable',
      ],
    },
    daysInStage: { type: Number, default: 1 },
    approvedAmount: { type: Number, default: 78000 },
    discomName: { type: String, default: 'JVVNL' },
    isStuck: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subsidy', subsidySchema);
