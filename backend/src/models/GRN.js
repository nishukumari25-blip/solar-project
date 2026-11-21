const mongoose = require('mongoose');

const grnSchema = new mongoose.Schema(
  {
    grnNumber: { type: String, required: true, unique: true },
    poId: { type: String, required: true },
    poNumber: { type: String, required: true },
    projectId: { type: String, required: true, index: true },
    vendorName: { type: String, required: true },
    challanNumber: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    receivedQuantity: { type: Number, required: true },
    itemCategory: { type: String, required: true },
    serialNumbers: [{ type: String }],
    challanPhotoUploaded: { type: Boolean, default: true },
    remarks: { type: String, default: '' },
    status: { type: String, default: 'Received at Site', enum: ['Received at Site', 'Reversed', 'Under Inspection'] },
    isReversed: { type: Boolean, default: false },
    reversalReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GRN', grnSchema);
