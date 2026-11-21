const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    leadCode: { type: String, required: true, unique: true, uppercase: true },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    city: { type: String, default: 'Jaipur' },
    state: { type: String, default: 'Rajasthan' },
    address: { type: String, trim: true },
    source: {
      type: String,
      default: 'Website Enquiry',
      enum: ['Website Enquiry', 'Google Ads', 'Referral', 'Cold Call / Field', 'DISCOM Exhibition', 'Other'],
    },
    monthlyElectricityBill: { type: Number, default: 0 },
    sanctionedLoadKW: { type: Number, default: 5 },
    proposedCapacityKW: { type: Number, default: 5 },
    assignedTo: { type: String, default: 'Rahul Verma' },
    status: {
      type: String,
      default: 'New',
      enum: ['New', 'Contacted', 'Survey Scheduled', 'Quote Sent', 'Under Negotiation', 'Converted', 'Lost'],
    },
    notes: { type: String, default: '' },
    linkedProjectId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
