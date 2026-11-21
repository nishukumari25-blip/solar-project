const mongoose = require('mongoose');

const customerPaymentSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'Received & Verified' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomerPayment', customerPaymentSchema);
