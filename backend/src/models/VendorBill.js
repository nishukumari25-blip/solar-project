const mongoose = require('mongoose');

const vendorBillSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true, unique: true },
    vendorName: { type: String, required: true },
    poNumber: { type: String, required: true },
    projectId: { type: String, required: true },
    billAmount: { type: Number, required: true },
    matchStatus: { type: String, default: 'Matched 100%', enum: ['Matched 100%', 'Mismatch Flagged'] },
    dueDate: { type: String, required: true },
    paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Partially Paid'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VendorBill', vendorBillSchema);
