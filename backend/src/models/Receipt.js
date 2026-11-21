const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receipt', receiptSchema);
