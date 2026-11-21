const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    refId: { type: String, required: true },
    projectId: { type: String, default: null },
    customerName: { type: String, default: '' },
    requestedBy: { type: String, required: true },
    requestDate: { type: String, required: true },
    details: { type: String, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected'],
    },
    approverRole: { type: String, default: 'Owner / Admin' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Approval', approvalSchema);
