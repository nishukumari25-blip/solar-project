const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    systemCapacityKW: { type: Number, required: true },
    taxableAmount: { type: Number, required: true },
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    invoiceDate: { type: String, required: true },
    status: { type: String, default: 'Issued', enum: ['Issued', 'Paid', 'Cancelled'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
