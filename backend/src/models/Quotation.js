const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: true, unique: true },
    version: { type: String, default: 'R1' },
    customerName: { type: String, required: true, trim: true },
    leadId: { type: String, default: null },
    systemCapacityKW: { type: Number, required: true },
    items: [
      {
        category: { type: String, required: true },
        specification: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
        gstRate: { type: Number, default: 12 },
      },
    ],
    basePrice: { type: Number, required: true },
    gstAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    totalSubsidy: { type: Number, default: 0 },
    netCustomerCost: { type: Number, required: true },
    instalments: [
      {
        milestoneNumber: { type: Number, required: true },
        label: { type: String, required: true },
        percentage: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      default: 'Sent',
      enum: ['Draft', 'Pending Approval', 'Sent', 'Accepted', 'Converted to Order', 'Rejected', 'Expired'],
    },
    date: { type: String, required: true },
    validityDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', quotationSchema);
