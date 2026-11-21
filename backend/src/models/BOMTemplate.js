const mongoose = require('mongoose');

const bomTemplateSchema = new mongoose.Schema(
  {
    templateCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    capacityKW: { type: Number, required: true },
    items: [
      {
        itemCategory: { type: String, required: true },
        specification: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, default: 0 },
        gstRate: { type: Number, default: 12 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('BOMTemplate', bomTemplateSchema);
