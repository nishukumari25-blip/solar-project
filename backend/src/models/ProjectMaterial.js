const mongoose = require('mongoose');

const projectMaterialSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    specification: { type: String, required: true },
    bomQty: { type: Number, required: true },
    poQty: { type: Number, default: 0 },
    grnQty: { type: Number, default: 0 },
    unit: { type: String, default: 'Nos' },
    status: { type: String, default: 'Fulfilled' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectMaterial', projectMaterialSchema);
