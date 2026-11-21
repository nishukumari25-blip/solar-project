const mongoose = require('mongoose');

const leftoverMaterialSchema = new mongoose.Schema(
  {
    sourceProjectId: { type: String, required: true, index: true },
    itemDescription: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    condition: { type: String, default: 'Brand New / Prime' },
    status: {
      type: String,
      default: 'Available at Site',
      enum: ['Available at Site', 'Transferred', 'Returned to Vendor'],
    },
    transferredToProject: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeftoverMaterial', leftoverMaterialSchema);
