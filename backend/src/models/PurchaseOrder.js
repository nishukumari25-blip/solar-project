const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true },
    vendorName: { type: String, required: true },
    items: [
      {
        itemCategory: { type: String, required: true },
        specification: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      default: 'Sent',
      enum: ['Draft', 'Pending Approval', 'Sent', 'Partially Received', 'Fully Received', 'Rejected', 'Cancelled'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
