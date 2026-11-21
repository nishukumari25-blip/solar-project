const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, uppercase: true },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    quotationId: { type: String, default: null },
    systemCapacityKW: { type: Number, required: true },
    paymentMode: {
      type: String,
      required: true,
      enum: ['Self-funded', 'Bank loan', 'Loan + margin money'],
      default: 'Self-funded',
    },
    financier: { type: String, default: null },
    managerId: { type: String, default: 'usr-4' },
    managerName: { type: String, default: 'Vikram Choudhary' },
    siteAddress: { type: String, required: true },
    status: {
      type: String,
      default: 'In Progress',
      enum: ['In Progress', 'Completed', 'Closed', 'On Hold', 'Cancelled'],
    },
    targetDate: { type: String, required: true },
    commissioningDate: { type: String, default: null },
    closedDate: { type: String, default: null },
    contractValue: { type: Number, required: true },
    totalReceived: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    isDelayed: { type: Boolean, default: false },
    subsidyStage: { type: String, default: 'Application Registered' },
    netMeteringNotApplicableReason: { type: String, default: null },
    pnlLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
