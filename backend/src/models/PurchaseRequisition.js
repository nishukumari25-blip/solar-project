const mongoose = require('mongoose');

const purchaseRequisitionSchema = new mongoose.Schema(
  {
    prNumber: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    itemCategory: { type: String, required: true },
    specification: { type: String, required: true },
    quantityRequired: { type: Number, required: true },
    unit: { type: String, required: true },
    leftoverOffsetQty: { type: Number, default: 0 },
    netOrderQty: { type: Number, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      default: 'Approved',
      enum: ['Draft', 'Pending Approval', 'Approved', 'Converted to PO', 'Rejected'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseRequisition', purchaseRequisitionSchema);
