const mongoose = require('mongoose');

const bankLoanSchema = new mongoose.Schema(
  {
    sanctionRef: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    bankName: { type: String, required: true },
    sanctionedAmount: { type: Number, required: true },
    tranche1Amount: { type: Number, required: true },
    tranche1Status: { type: String, default: 'Disbursed', enum: ['Pending', 'Disbursed'] },
    tranche2Amount: { type: Number, required: true },
    tranche2Status: { type: String, default: 'Pending', enum: ['Pending', 'Disbursed'] },
    daysInProcessing: { type: Number, default: 5 },
    status: { type: String, default: 'Tranche 1 Disbursed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BankLoan', bankLoanSchema);
