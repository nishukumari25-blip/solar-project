const mongoose = require('mongoose');

const projectPnLSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    contractValue: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    moduleCost: { type: Number, default: 0 },
    structureCost: { type: Number, default: 0 },
    bosCost: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    grossProfit: { type: Number, required: true },
    grossMarginPct: { type: String, required: true },
    status: {
      type: String,
      default: 'Active (In Progress)',
      enum: ['Active (In Progress)', 'Locked (Project Closed)'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectPnL', projectPnLSchema);
